import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import WebFont from 'webfontloader';

import TextIcon from './SVG/Text';

const BLUE = '#007aff';

console.log('R', React);
console.log('P', PropTypes);

const TextArea = styled.textarea`
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  color: ${({ style: { color } }) => color || '#ffffff'};
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  outline: none;
  font-family: 'Source Sans Pro', sans-serif;
  resize: none;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  -webkit-user-select: text;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ControlsWrapper = styled.div`
  position: fixed;
  top: 16px;
  left: 0;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  backdrop-filter: blur(12px);
  background: rgba(34, 34, 34, 0.7);
  border-radius: 12px;
  padding: 4px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Control = styled.div`
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  max-width: 150px;
  opacity: 1;
  pointer-events: auto;
  padding: 6px;
  user-select: none;
  transition: 0.05s ease transform;
  margin: 0 2px;

  display: flex;
  align-items: center;
  justify-content: space-around;

  :hover {
    background-color: #17171777;
  }

  img, svg {
    width: 24px;
    height: 24px;
    fill: #ffffff;
  }
`;

const ColorPicker = styled.div`
  position: absolute;
  top: 56px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  opacity: ${({ style: { isShowingColorPicker } }) => isShowingColorPicker ? '1' : '0'};
  transform: translateY(${({ style: { isShowingColorPicker } }) => isShowingColorPicker ? '0' : '-16px'});
  transition: all 0.2s ease-in-out;

  > * {
    pointer-events: ${({ style: { isShowingColorPicker } }) => isShowingColorPicker ? 'initial' : 'none'};
  }
`;

const TextColorOption = styled.div`
  margin: 0 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid ${({ style: { isActive } }) => isActive ? BLUE : '#ffffff'};
  background: ${({ style: { textColorOption } }) => textColorOption};
  cursor: pointer;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`;

const FontPicker = styled.div`
  position: absolute;
  top: 56px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  opacity: ${({ style: { isShowingFontPicker } }) => isShowingFontPicker ? '1' : '0'};
  transform: translateY(${({ style: { isShowingFontPicker } }) => isShowingFontPicker ? '0' : '-16px'});
  transition: all 0.2s ease-in-out;

  > * {
    pointer-events: ${({ style: { isShowingFontPicker } }) => isShowingFontPicker ? 'initial' : 'none'};
  }
`;

const FontOption = styled.div`
  margin: 0 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid ${({ style: { isActive } }) => isActive ? BLUE : '#ffffff'};
  background: url(${({ style: { fontOption } }) => fontOption.icon}) center center / cover;
  cursor: pointer;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`;

const TextEdit = (props) => {
  const {
    colorOptions,
    fontOptions,
    fontValue,
    open,
    onCloseModal,
    onTextBlur,
    onTextChange,
    onColorChange,
    onFontChange,
    onFontsLoaded,
    textColor,
    textValue,
  } = props;

  const [isShowingColorPicker, setIsShowingColorPicker] = useState(false);
  const [isShowingFontPicker, setIsShowingFontPicker] = useState(false);
  const [color, setColor] = useState(textColor);
  const [font, setFont] = useState('');
  const [value, setValue] = useState(textValue);

  const textAreaRef = useRef(null);

  useEffect(() => {
    WebFont.load({
      active: () => {
        onFontsLoaded();
      },
      google: {
        families: fontOptions.filter(({ googleFont }) => !!googleFont).map(({ googleFont }) => googleFont),
      },
    });
  }, []);

  const resizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextArea();
  }, [value, textAreaRef.current]);

  useEffect(() => {
    let timeout;

    if (open) {
      timeout = window.setTimeout(() => {
        document.execCommand('selectAll', false, null);
      }, 150);
    }

    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    const onPointerUp = (e) => {
      if (e.target.closest('.control') || e.target.closest('.textarea')) return;

      onCloseModal();
    };

    document.addEventListener('pointerup', onPointerUp);

    return () => document.removeEventListener('pointerup', onPointerUp);
  }, []);

  useEffect(() => {
    if (!open) {
      setIsShowingColorPicker(() => false);
      setIsShowingFontPicker(() => false);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      styles={{
        modal: {
          width: '100vw',
          height: '100vh',
          background: 'none',
          padding: 0,
          boxShadow: 'none',
        },
        overlay: {
          padding: 0,
        },
      }}
    >
      <ControlsWrapper className={'control'}>
        <Controls>
          <Control
            onClick={() => {
              setIsShowingColorPicker(false);
              setIsShowingFontPicker((i) => !i);
            }}
            title={'Change text style'}
          >
            <TextIcon />
          </Control>
          <Control
            onClick={() => {
              setIsShowingFontPicker(false);
              setIsShowingColorPicker((i) => !i);
            }}
            title={'Change text color'}
          >
            <img
              alt={'Color gradient swatch'}
              src={'https://images.koji-cdn.com/959d1968-a7b5-4566-911f-dcb7a36cc600/sevgi-textColor.png'}
            />
          </Control>
        </Controls>

        <FontPicker style={{ isShowingFontPicker }}>
          {
            fontOptions.map((fontOption) => (
              <FontOption
                onClick={() => {
                  setFont(fontOption);
                  onFontChange(fontOption);
                }}
                key={fontOption.fontFamily}
                style={{ isActive: font === fontOption, fontOption }}
                title={fontOption.fontFamily}
              />
            ))
          }
        </FontPicker>

        <ColorPicker style={{ isShowingColorPicker }}>
          {
            colorOptions.map((textColorOption) => (
              <TextColorOption
                key={textColorOption}
                onClick={() => {
                  setColor(textColorOption);
                  onColorChange(textColorOption);
                }}
                style={{ isActive: color === textColorOption, textColorOption }}
              />
            ))
          }
        </ColorPicker>
      </ControlsWrapper>
      <TextArea
        className={'textarea'}
        onBlur={() => {
          onTextBlur(value);
        }}
        onChange={(e) => {
          setValue(e.target.value);
          onTextChange(e.target.value);
        }}
        ref={textAreaRef}
        style={{
          color,
          fontFamily: fontValue.fontFamily,
          ...fontValue.style,
        }}
        value={value}
      />
    </Modal>
  );
};

TextEdit.propTypes = {
  colorOptions: PropTypes.arrayOf(PropTypes.string),
  fontOptions: PropTypes.arrayOf(PropTypes.object),
  onCloseModal: PropTypes.func,
  onColorChange: PropTypes.func,
  onFontChange: PropTypes.func,
  onFontsLoaded: PropTypes.func,
  onTextBlur: PropTypes.func,
  onTextChange: PropTypes.func,
  open: PropTypes.bool,
  fontValue: PropTypes.shape({
    googleFont: PropTypes.string,
    fontFamily: PropTypes.string,
    weight: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    icon: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object,
  }),
  textColor: PropTypes.string,
  textValue: PropTypes.string,
};

TextEdit.defaultProps = {
  colorOptions: ['#ffffff', '#000000', '#828282', '#eb5757', '#f2994a', '#f2C94c', '#27ae60', '#2d9cdb', '#bb6bd9'],
  fontOptions: [
    {
      googleFont: 'Oswald:700',
      fontFamily: 'Oswald',
      weight: 700,
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/azm1i-oswaldBold.png',
    },
    {
      googleFont: 'Volkhov:700',
      fontFamily: 'Volkhov',
      weight: 700,
      style: {
        fontStyle: 'italic',
      },
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/0k9y0-volkhovBoldItalic.png',
    },
    {
      googleFont: 'Source Sans Pro',
      fontFamily: 'Source Sans Pro',
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/q86h4-sourceSansProRegular.png',
    },
    {
      googleFont: 'Special Elite',
      fontFamily: 'Special Elite',
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/ujnvy-specialElite.png',
    },
    {
      googleFont: 'Nunito',
      fontFamily: 'Nunito',
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/x8zvh-nunitoSemibold.png',
    },
    {
      googleFont: 'Dancing Script',
      fontFamily: 'Dancing Script',
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/2ws9c-dancingScriptRegular.png',
    },
    {
      googleFont: 'Poppins:ital,500',
      fontFamily: 'Poppins',
      weight: 500,
      style: {
        fontStyle: 'italic',
      },
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/v72ke-poppinsMediumItalic.png',
    },
    {
      googleFont: 'Amatic SC:700',
      fontFamily: 'Amatic SC',
      weight: 700,
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/0wah9-amaticScBold.png',
    },
    {
      googleFont: 'Permanent Marker',
      fontFamily: 'Permanent Marker',
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/s9v1s-permanentMarker.png',
    },
    {
      googleFont: 'Abril Fatface',
      fontFamily: 'Abril Fatface',
      icon: 'https://images.koji-cdn.com/0d36d41d-ba5b-4491-a970-e793864e5bda/4ovrh-abrilFatface.png',
    },
  ],
  fontValue: {},
  onCloseModal() { },
  onColorChange() { },
  onFontChange() { },
  onFontsLoaded() { },
  onTextBlur() { },
  onTextChange() { },
  open: false,
  textColor: '',
  textValue: '',
};

export default TextEdit;
