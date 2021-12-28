import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ChangeEvent, useState } from 'react';
import {
  UserWord, Status, CurrentUserLanguages, Translation,
} from '../../types';
import wordsService from '../../services/words';
import translationServices from '../../services/translations';
import {
  userwordsState, currentwordState, currenttextState, currentUserLanguagesState,
} from '../../states/recoil-states';

const TranslationComponent = function({ word }: { word: UserWord | null }) {
  const [userWords, setUserWords] = useRecoilState(userwordsState);
  const setCurrentWord = useSetRecoilState(currentwordState);
  const currentWord = useRecoilValue(currentwordState);
  const currentText = useRecoilValue(currenttextState);
  const currentUserLanguages = useRecoilValue(currentUserLanguagesState);

  function isCurrentUserLanguage(currentUserLangs: CurrentUserLanguages | null)
    : currentUserLangs is CurrentUserLanguages {
    return (currentUserLangs as CurrentUserLanguages)?.currentLearnLanguageId !== undefined;
  }

  const handleTranslation = async function(
    event: React.FormEvent<HTMLFormElement>,
    translation: string,
    userWord: UserWord | null,
  ) {
    event.preventDefault();

    if (userWord) {
      const newUserWord = { ...userWord };
      // change id to id
      if (isCurrentUserLanguage(currentUserLanguages)) {
        if (!newUserWord.id) {
          // call api with word with translation object attatched
          const translationObj: Translation = {
            translation,
            targetLanguageId: currentUserLanguages?.currentLearnLanguageId,
            context: '',
          };

          const translations = [...userWord.translations, translationObj];
          newUserWord.translations = translations;

          const userWordFromServer = await wordsService.addWordWithTranslation(newUserWord);
          setCurrentWord(userWordFromServer);

          const updatedWords = [...userWords
            .filter((wordObj: UserWord) => wordObj.word.toLowerCase()
            !== newUserWord.word.toLowerCase()), userWordFromServer];
          setUserWords(updatedWords);
        } else {
          // call api with translation object, add word id to translation obj
          const newTranslationObj: Translation = {
            translation,
            targetLanguageId: currentUserLanguages?.currentLearnLanguageId,
            context: '',
            wordId: newUserWord.id,
          };
          const translations = [...userWord.translations, newTranslationObj];
          newUserWord.translations = translations;
          setCurrentWord(newUserWord);

          const response = await translationServices.addTranslation(newTranslationObj);
          console.log(response);
        }
      }
      setCurrentWord(newUserWord);

      const updatedWords = [...userWords.filter((wordObj: UserWord) => wordObj.word.toLowerCase()
        !== newUserWord.word.toLowerCase()), newUserWord];
      setUserWords(updatedWords);
    }
  };

  // if a translation is not set, the state should be restored to 'undefined'
  const [translation, setTranslation] = useState('');
  const handleInput = function(event: ChangeEvent<HTMLInputElement>) {
    setTranslation(event.target.value);
  };

  // once translations are converted to objects, remove the || from the translations.map line
  return (
    <div className="translation-div">
      {word && word?.translations?.length > 0
      && <p>Current translation: {word?.translations.map((transObj) => `${transObj.translation || transObj}, `)}</p>}
      {currentWord && <iframe width="350" height="500" src={`https://www.wordreference.com/${currentText?.languageId}en/${currentWord.word}`}></iframe>}
      <form onSubmit={(event) => {
        handleTranslation(event, translation, word);
        setTranslation('');
      }} action="">
        <label htmlFor='translation'>
          Write your translation here:
        </label>
        <input id='translation' onChange={(event) => handleInput(event)} value={translation} type={'text'} />

        <button type={'submit'}>Submit</button>
      </form>
    </div>
  );
};

const ChangeStatus = function({ word }: { word: UserWord | null }) {
  const [userWords, setUserWords] = useRecoilState(userwordsState);
  const setCurrentWord = useSetRecoilState(currentwordState);
  const setWordStatus = function(status: Status, userWord: UserWord) {
    const newUserWord = { ...userWord };
    newUserWord.status = status;
    // change id to id when server returns it correctly
    if (newUserWord.id) {
      const updatedStatus = wordsService.updateStatus(String(newUserWord.id));
      console.log(updatedStatus);
    }
    setCurrentWord(newUserWord);

    const updatedWords = [...userWords.filter((wordObj: UserWord) => wordObj.word.toLowerCase()
      !== newUserWord.word.toLowerCase()), newUserWord];
    setUserWords(updatedWords);
  };

  const wordStatusToolbar = word
    ? <div className="word-status-toolbar">;
        <button onClick={() => setWordStatus('learning', word)} type={'button'}>Learning</button>
        <button onClick={() => setWordStatus('familiar', word)} type={'button'}>Familiar</button>
        <button onClick={() => setWordStatus('learned', word)} type={'button'}>Learned</button>
        <button onClick={() => setWordStatus(undefined, word)} type={'button'}>Ignore</button>
      </div>
    : '';

  return (
    <div className="change-status-div">
      {word && <p>Current status: {word.status}</p>}
      {wordStatusToolbar}
    </div>
  );
};


const TranslationInput = function({ word }: { word: UserWord | null }) {
  return (
    <div className="user-input-div">
      {word && <p>Selected word: {word.word}</p>}
      {!word && <p>Select a word</p>}
      <TranslationComponent word={word} />
      <ChangeStatus word={word} />
    </div>
  );
};

export default TranslationInput;
