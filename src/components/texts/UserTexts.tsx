/* eslint-disable max-len */
import { useState, useEffect, FormEvent } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import textsService from '../../services/texts';
import Nav from '../Nav';
import { Text } from '../../types';

import { textlistState, currenttextState } from '../../states/recoil-states';


const IndividualText = function({ text }: { text: Text }) {
  const setCurrentText = useSetRecoilState(currenttextState);

  return (
    <li className='textItem'>
      <h2><a href='#' onClick={(_event) => setCurrentText(text)}>{text.title}</a></h2>
      {/* <p>{text.body.slice(0, 297).padEnd(300, '.')}</p> // doesn't work on short texts */}
      <p>{`${text.body.slice(0, 297)}...`}</p>
    </li>
  );
};

const NewTextForm = function({
  submitText, setNewTextTitle, setNewText, newTextTitle, newText,
}:
{ submitText: Function, setNewTextTitle: Function, setNewText: Function, newTextTitle: string, newText: string }) {
  return (
    <div >
      <p>Add a new text here:</p>
      <form className='newTextForm' onSubmit={(event) => submitText(event)}>
      <input type={'text'} placeholder='title' name='title' value={newTextTitle} onChange={(e) => setNewTextTitle(e.target.value)}></input>
      <textarea name='text' placeholder='text body' value={newText} onChange={(e) => setNewText(e.target.value)}></textarea>
      <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

const UserTexts = function() {
  const [textList, setTextList] = useRecoilState(textlistState);
  const [loaded, setLoaded] = useState(false);
  const [newText, setNewText] = useState('');
  const [newTextTitle, setNewTextTitle] = useState('');

  useEffect(() => {
    const fetchUserTexts = async function() {
      const userTextsResponse = await textsService.getAllUserTexts();

      setTextList(userTextsResponse);
      setLoaded(true);
    };

    fetchUserTexts();
  }, []);

  const submitText = async function(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newTextObj: Text = {
      // "userId": 1, get on backend from token
      languageId: 'en',
      title: newTextTitle,
      body: newText,
    };

    const addTextResponse = await textsService.postNewText(newTextObj);
    const newUsersTexts = [...textList, addTextResponse];
    setTextList(newUsersTexts);
    setLoaded(true);
    setNewText('');
    setNewTextTitle('');
  };

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
      <div>
        <Nav />
        {textList.length === 0 && <li>You have no texts, please add a text to begin.</li>}
        <NewTextForm submitText={submitText} newTextTitle={newTextTitle} newText={newText} setNewTextTitle={setNewTextTitle} setNewText={setNewText} />
        <ul className='textList'>
          {textList.map((text) => <IndividualText key={text.id} text={text} />)}
        </ul>
      </div>
  );
};

export default UserTexts;