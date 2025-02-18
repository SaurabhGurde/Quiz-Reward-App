import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import Checkbox from './ui/Checkbox';
import ProgressBar from './ui/ProgressBar';
import {
  exampleQuestionType,
  nextLayerConditionType,
  noSelectedType,
  passConditionType,
  questionType,
  yesSelectedType,
} from '../types/index';

interface PropType {
  question: questionType;
  questionNo: number;
  handleNextQuestion: (qNo: number, data: any) => void;
  handlePrevClick: (qNo: number) => void;
}

const Question: React.FC<PropType> = ({
  question,
  questionNo,
  handleNextQuestion,
  handlePrevClick,
}) => {
  const [mainAnswer, setMainAnswer] = useState<'yes' | 'no' | ''>('');
  const [subAnswer, setSubAnswer] = useState<('yes' | 'no')[]>([]);
  const [currentSubQuestionIndex, setCurrentSubQuestionIndex] =
    useState<number>(0);
  const [currentLayer, setCurrentLayer] = useState<
    yesSelectedType | noSelectedType
  >();
  const [isPassCheckDone, setIsPassCheckDone] = useState<boolean>(false);
  const [isSelectionOn, setIsSelectionOn] = useState<boolean>(false);
  const [selectionAnswer, setSelectionAnswer] = useState<exampleQuestionType[]>(
    [],
  );
  const [passCheck, setPassCheck] = useState<'pass' | 'fail'>();
  const [subAnswerProgress, setSubAnswerProgress] = useState<number>(0);

  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    slideAnim.setValue(-300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentSubQuestionIndex, currentLayer]);

  useEffect(() => {
    setMainAnswer('');
    setIsPassCheckDone(false);
    setIsSelectionOn(false);
    setCurrentLayer(undefined);
  }, [question]);

  const onMainAnswerChange = (data: 'yes' | 'no') => {
    setMainAnswer(data);
    setSubAnswer([]);
    setCurrentSubQuestionIndex(0);
    setSubAnswerProgress(0);
    if (data === 'yes') {
      setCurrentLayer(question.yesSelected);
      if (question.yesSelected.questions.length === 0) {
        handleValidation([], question.yesSelected.passCondition);
      }
    } else {
      setCurrentLayer(question.noSelected);
      if (question.noSelected.questions.length === 0) {
        handleValidation([], question.noSelected.passCondition);
      }
    }
  };

  const onSubAnswerChange = (answer: 'yes' | 'no', index: number) => {
    const arr = [...subAnswer];
    arr[index] = answer;
    setSubAnswer(arr);

    if (currentLayer?.questions) {
      setSubAnswerProgress(
        ((currentSubQuestionIndex + 1) * 100) / currentLayer.questions.length,
      );
      if (currentLayer.questions.length - 1 === index) {
        setSubAnswerProgress(100);
        handleValidation(arr, currentLayer.passCondition);
        return;
      }
    }

    setTimeout(() => {
      setCurrentSubQuestionIndex(index + 1);
    }, 100);
  };

  const handleSelectionAnswer = (
    data: exampleQuestionType,
    bool: boolean,
    index: number,
  ) => {
    const temp = [...selectionAnswer];
    if (bool) {
      temp[index] = data;
    } else {
      temp.splice(index, 1);
    }
    setSelectionAnswer(temp);

    let passCount = 0;
    let failCount = 0;
    temp.forEach(e => {
      if (e?.example === 'pass') {
        passCount++;
      } else if (e?.example === 'fail') {
        failCount++;
      }
    });

    setPassCheck(
      passCount >= failCount ? 'pass' : failCount > 0 ? 'fail' : undefined,
    );
    setIsPassCheckDone(temp.length > 0);
  };

  const checkForYesToOnlyPassFail = (): 'pass' | 'fail' | 'both' => {
    let passCount = 0;
    let failCount = 0;
    const questionsArr = currentLayer?.questions ?? [];
    subAnswer.forEach((e, i) => {
      if (e === 'yes' && questionsArr[i].example === 'pass') {
        passCount++;
      }
      if (e === 'yes' && questionsArr[i].example === 'fail') {
        failCount++;
      }
    });

    if (passCount > 0 && failCount === 0) {
      return 'pass';
    } else if (failCount > 0 && passCount === 0) {
      return 'fail';
    } else {
      return 'both';
    }
  };

  const handlePassFailCheck = (
    subAnswerList?: ('yes' | 'no')[],
    conditionargs?: passConditionType | nextLayerConditionType,
  ) => {
    let yesCount = 0;
    let noCount = 0;
    const answerList = subAnswerList ?? subAnswer;

    answerList.forEach(e => {
      if (e === 'yes') {
        yesCount++;
      } else {
        noCount++;
      }
    });

    let condition: passConditionType | nextLayerConditionType | undefined;
    condition = conditionargs ?? currentLayer?.passCondition;

    switch (condition) {
      case 'all-yes':
        if (yesCount === answerList.length) {
          return true;
        } else if (
          currentLayer?.nextLayerCondition &&
          handlePassFailCheck(answerList, currentLayer.nextLayerCondition)
        ) {
          return 'next-layer';
        } else {
          return false;
        }
      case 'all-no':
        return noCount === answerList.length;
      case 'any-yes':
        if (yesCount > 0) {
          return true;
        } else if (
          currentLayer?.nextLayerCondition &&
          handlePassFailCheck(answerList, currentLayer.nextLayerCondition)
        ) {
          return 'next-layer';
        } else {
          return false;
        }
      case 'any-no':
        return noCount > 0;
      case 'max-yes':
        return yesCount >= noCount;
      case 'max-no':
        return yesCount <= noCount;
      case 'pass-direct':
        return true;
      case 'fail-direct':
        return false;
      case 'yes-to-only-pass-fail':
        const answer = checkForYesToOnlyPassFail();
        if (answer === 'pass' || answer === 'fail') {
          return answer;
        } else {
          return 'both';
        }
      case 'yes-to-one-or-less':
        if (yesCount <= 1) {
          return true;
        } else if (
          currentLayer?.nextLayerCondition === 'yes-to-two-or-more' &&
          yesCount > 1
        ) {
          return 'next-layer';
        } else {
          return false;
        }
      case 'yes-to-two-or-more':
        if (yesCount >= 2) {
          return true;
        } else if (
          currentLayer?.nextLayerCondition === 'yes-to-only-one' &&
          yesCount === 1
        ) {
          return 'next-layer';
        } else {
          return false;
        }
      case 'next-layer':
        if (
          currentLayer?.nextLayerCondition === 'all-yes' &&
          yesCount === answerList.length
        ) {
          return 'next-layer';
        } else {
          return false;
        }
      default:
        return false;
    }
  };

  const handleValidation = (
    subAnswerList: ('yes' | 'no')[],
    condition: passConditionType | nextLayerConditionType,
  ) => {
    const passResult = handlePassFailCheck(subAnswerList, condition);

    if (passResult === 'both') {
      setIsSelectionOn(true);
      return;
    }
    if (passResult === 'next-layer') {
      setCurrentSubQuestionIndex(0);
      setCurrentLayer(currentLayer?.nextLayer);
      setSubAnswerProgress(0);
      setSubAnswer([]);
    } else {
      setPassCheck(passResult ? 'pass' : 'fail');
      setIsPassCheckDone(true);
    }
  };

  const handleNextClick = () => {
    handleNextQuestion(questionNo, {
      ...question,
      answer: passCheck,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with question number and title */}
      <View style={styles.titleContainer}>
        <Text style={styles.questionNumber}>{questionNo + 1}.</Text>
        <Text style={styles.questionTitle}>{question.title}</Text>
      </View>

      {question.description && (
        <Text style={styles.descriptionText}>
          ( For example {question.description} )
        </Text>
      )}

      {/* Main answer checkboxes */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value="yes"
          label="Yes"
          onCheckboxChange={onMainAnswerChange}
          checked={mainAnswer}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value="no"
          label="No"
          onCheckboxChange={onMainAnswerChange}
          checked={mainAnswer}
        />
      </View>

      {/* Progress bar if subquestions exist */}
      {mainAnswer &&
        currentLayer &&
        !isSelectionOn &&
        currentSubQuestionIndex >= 0 &&
        currentLayer.questions.length !== 0 && (
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={subAnswerProgress}
              barWidth="90%"
              bgColor="#93C5FD"
            />
          </View>
        )}

      {currentLayer && !currentLayer.title ? (
        <Text
          style={[
            styles.layerTitle,
            isSelectionOn ? styles.marginTopLarge : styles.marginTopSmall,
          ]}>
          {mainAnswer &&
            (mainAnswer === 'yes'
              ? currentLayer.questions.length > 0 &&
                !isSelectionOn &&
                `"If yes then..." ${
                  currentLayer.title ?? question.yesDescription
                }`
              : currentLayer.questions.length > 0 &&
                !isSelectionOn &&
                `"If no then..." ${
                  currentLayer.title ?? question.noDescription
                }`)}
        </Text>
      ) : (
        <Text
          style={[
            styles.layerTitle,
            isSelectionOn ? styles.marginTopLarge : styles.marginTopSmall,
          ]}>
          {currentLayer?.title}
        </Text>
      )}

      {/* List of subquestions with slide animation */}
      <View style={styles.subQuestionContainer}>
        {mainAnswer &&
          currentLayer &&
          !isSelectionOn &&
          currentSubQuestionIndex >= 0 &&
          currentLayer.questions.length !== 0 && (
            <Animated.View
              style={[
                styles.subQuestionAnimated,
                {transform: [{translateX: slideAnim}]},
              ]}>
              <View style={styles.subQuestionTitleContainer}>
                <Text style={styles.subQuestionNumber}>
                  {currentSubQuestionIndex + 1})
                </Text>
                <Text style={styles.subQuestionTitle}>
                  {currentLayer.questions[currentSubQuestionIndex].title}
                </Text>
              </View>

              <View style={styles.checkboxContainer}>
                <Checkbox
                  value="yes_sub"
                  label="Yes"
                  onCheckboxChange={() =>
                    onSubAnswerChange('yes', currentSubQuestionIndex)
                  }
                  checked={
                    subAnswer[currentSubQuestionIndex] === 'yes'
                      ? 'yes_sub'
                      : ''
                  }
                />
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value="no_sub"
                  label="No"
                  onCheckboxChange={() =>
                    onSubAnswerChange('no', currentSubQuestionIndex)
                  }
                  checked={
                    subAnswer[currentSubQuestionIndex] === 'no' ? 'no_sub' : ''
                  }
                />
              </View>
            </Animated.View>
          )}
      </View>

      {/* Multiple selection section */}
      {isSelectionOn && currentLayer && (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionTitle}>
            Which one does he/she do most often?
          </Text>
          {currentLayer.questions.map((data, index) => (
            <Checkbox
              value={`selection ${index}`}
              key={index}
              label={data.title}
              onCheckboxChange={(bool: boolean) =>
                handleSelectionAnswer(data, bool, index)
              }
            />
          ))}
        </View>
      )}

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handlePrevClick(questionNo)}
          disabled={questionNo === 0}
          style={[styles.button, questionNo === 0 && styles.disabledButton]}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextClick}
          disabled={!isPassCheckDone}
          style={[styles.button, !isPassCheckDone && styles.disabledButton]}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Question;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    // backgroundColor: '#D1FAE5',
    alignSelf: 'center',
    padding: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  questionNumber: {
    fontWeight: '600',
    fontSize: 19,
    color: '#065F46',
  },
  questionTitle: {
    marginLeft: 4,
    fontSize: 19,
    color: '#065F46',
  },
  descriptionText: {
    fontSize: 14,
    marginLeft: 20,
    textAlign: 'left',
    color: '#065F46',
  },
  checkboxContainer: {
    marginLeft: 20,
    marginTop: 10,
  },
  progressBarContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  layerTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 8,
    textAlign: 'left',
    color: '#065F46',
  },
  marginTopLarge: {
    marginTop: 40,
  },
  marginTopSmall: {
    marginTop: 12,
  },
  subQuestionContainer: {
    opacity: 1,
  },
  subQuestionAnimated: {
    marginLeft: 20,
  },
  subQuestionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  subQuestionNumber: {
    fontWeight: '600',
    fontSize: 19,
    color: '#065F46',
  },
  subQuestionTitle: {
    marginLeft: 4,
    fontSize: 19,
    color: '#065F46',
  },
  selectionContainer: {
    marginLeft: 20,
    marginTop: 20,
  },
  selectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#065F46',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '15%',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#10B981', // Green button
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#A7F3D0', // Lighter green for disabled state
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
