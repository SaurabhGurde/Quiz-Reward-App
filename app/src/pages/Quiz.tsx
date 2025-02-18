import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated, ScrollView} from 'react-native';
import Question from '../component/Question';
import ProgressBar from '../component/ui/ProgressBar';
import QuestionsData from '../data/index';
import {updateAnswer} from '../redux/quizSlice';
import {questionType} from '../types';
import {StackScreenProps} from '@react-navigation/stack';
import api from '../api';
import Toast from 'react-native-toast-message';
import {setInitialUserDetails} from '../redux/userSlice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {getItem, setItem} from '../common/AsyncStorage';

type RootStackParamList = {
  [key: string]: any;
};

type QuizScreenProps = StackScreenProps<RootStackParamList, 'Quiz'>;

type resType = {
  data?: {
    [key: string]: any;
  };
  [key: string]: any;
};

const Quiz = (props: QuizScreenProps) => {
    let dispatch = useAppDispatch();
    const userDetails = useAppSelector(state => state.user);

  const [currentQuestion, setCurrentQuestion] = useState(QuestionsData[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleDailyBonusclaim = async () => {

    let res = await api.post<resType>(
      'data/handleDailyUserbonus',
      {id: userDetails.id, rewardAmount: 1000},
      dispatch,
    );
    if (res.status === 200) {
     let userDetails = await getItem('userDetails');
      await setItem('userDetails', {
        ...userDetails,
        ...res.data.user
      });
      dispatch(setInitialUserDetails(res.data.user));
      Toast.show({
        type: 'success',
        text2: 'Congratulations you got 1000 reward points!',
      });
    } else {
      Toast.show({
        type: 'error',
        text2: 'Failed to claim Bonus try again!',
      });
    }
  };

  const handleNextQuestion = (index: number, answer: questionType) => {
    dispatch(updateAnswer({...answer, index}));
    if (index + 1 === QuestionsData.length) {
     handleDailyBonusclaim();
      props.navigation.navigate('Result');
      return;
    }
    setCurrentQuestionIndex(index + 1);
    setCurrentQuestion(QuestionsData[index + 1]);
  };

  const handlePrevClick = (index: number) => {
    if (index === 0) return;
    setCurrentQuestionIndex(index - 1);
    setCurrentQuestion(QuestionsData[index - 1]);
  };

  const slideAnim = useRef(new Animated.Value(-50)).current;
  useEffect(() => {
    slideAnim.setValue(-50);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion, slideAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome to M-CHAT-R Questionnaire Evaluation Module
      </Text>
      {currentQuestionIndex >= 0 && (
        <View style={styles.progressContainer}>
          <ProgressBar
            barWidth="90%"
            bgColor="#93C5FD"
            progress={(currentQuestionIndex / QuestionsData.length) * 100}
          />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.questionContainer,
            {transform: [{translateY: slideAnim}]},
          ]}>
          {currentQuestion && (
            <Question
              key={currentQuestion.id}
              question={currentQuestion}
              questionNo={currentQuestionIndex}
              handleNextQuestion={handleNextQuestion}
              handlePrevClick={handlePrevClick}
            />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f9e6',
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 16,
    color: '#1B5E20',
  },
  progressContainer: {
    marginTop: '10%',
    marginBottom: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  questionContainer: {
    alignSelf: 'center',
    width: '100%',
    borderColor: 'black',
  },
});

export default Quiz;
