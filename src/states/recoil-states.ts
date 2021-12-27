import { atom, selector } from 'recoil';
import { UserWord, MarkedWords, Text } from '../types';


export const textlistState = atom<Array<Text>>({
  key: 'textlistState',
  default: [],
});


export const currenttextState = atom<Text | null>({
  key: 'currenttextState',
  default: null,
});


export const userwordsState = atom<Array<UserWord>>({
  key: 'userwordsState',
  default: [],
});


export const currentwordState = atom<UserWord | null>({
  key: 'currentwordState',
  default: null,
});


export const markedwordsState = selector({
  key: 'markedwordsState',
  get: ({ get }) => {
    const markedWords: MarkedWords = {};

    const userWords = get(userwordsState);
    userWords.forEach((userWord) => {
      if (userWord.status) markedWords[userWord.word] = userWord.status;
    });

    return markedWords;
  },
});