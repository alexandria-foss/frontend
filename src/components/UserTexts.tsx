import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import textsService from '../services/userTexts';
import Nav from './Nav';
import { Text } from '../types';

const IndividualText = function({ text, openText }: { text: Text, openText: Function }) {
  return (

    <li onClick={(event) => openText(event, text)}>
      <h2>{text.title}</h2>
      <p>{text.body.slice(0, 300)}</p>
    </li>
  );
};

const UserTexts = function({ openText }: { openText: Function }) {
  const [texts, setTexts] = useState<Text[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getUserTexts = function() {
    textsService.getAllUserTexts().then((textsFromServer) => {
      setTexts(textsFromServer);
      setIsLoaded(true);
    });
  };

  useEffect(getUserTexts, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
      <div>
        <Nav />
        <ul>
          {texts.map((text) => <><Link to={`/texts/${text.id}`}><h2>{text.title}</h2></Link><IndividualText key={text.id} openText={openText} text={text} /></>)}
        </ul>
      </div>
  );
};

export default UserTexts;
