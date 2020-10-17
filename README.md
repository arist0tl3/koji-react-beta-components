# koji-react-beta-components

## Installation

`npm install --save @arist0tl3/koji-react-beta-components`

## Usage

See below for a basic example. You can also check out https://withkoji.com/~seane/text-component-test for a live example.

```
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import styled from 'styled-components';

import get from 'utils/get';
import useStore from 'Store/useStore';
import { InstantRemixing } from '@withkoji/vcc';

import { EditTextModal } from '@arist0tl3/koji-react-beta-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333333;
  color: #ffffff;
`;

const Remix = () => {
  const instantRemixing = new InstantRemixing();

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [title, setTitle] = useState(instantRemixing.get(['strings', 'title']));
  const [titleColor, setTitleColor] = useState(instantRemixing.get(['strings', 'titleColor']));
  const [titleFontFamily, setTitleFontFamily] = useState(instantRemixing.get(['strings', 'titleFontFamily']));
  const [titleStyle, setTitleStyle] = useState(instantRemixing.get(['strings', 'titleStyle']));

  useEffect(() => {
    instantRemixing.onValueChanged(() => {
      // Handle state updates
    });

    instantRemixing.ready();
  }, []);

  return (
    <Container>
      <h1
        onClick={() => setIsEditingTitle(true)}
        style={{
          color: titleColor,
          fontFamily: titleFontFamily,
          ...titleStyle,
        }}
      >
        {title}
      </h1>
      <EditTextModal
        fontValue={{
          fontFamily: titleFontFamily,
          style: titleStyle,
        }}
        onColorChange={(color) => {
          instantRemixing.onSetValue(['strings', 'titleColor'], color);
        }}
        onFontChange={({ fontFamily, style = {} }) => {
          instantRemixing.onSetValue(['strings', 'titleFontFamily'], fontFamily);
        }}
        onTextBlur={(val) => {
          instantRemixing.onSetValue(['strings', 'title'], val);
        }}
        onCloseModal={() => setIsEditingTitle(false)}
        open={isEditingTitle}
        textValue={title}
      />
    </Container>
  );
};

export default Remix;
```