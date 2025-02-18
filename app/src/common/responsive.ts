import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


export const hp = (percent: number): number => {
  return (height * percent) / 100;
};



export const wp = (percent: number): number => {
  return (width * percent) / 100;
};
