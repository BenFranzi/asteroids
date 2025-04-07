import { css } from '@emotion/react';

const keysStyles = css`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const Tips = () => {
  return (
    <div>
      <div css={keysStyles}>
        <kbd>w</kbd>
        <kbd>a</kbd>
        <kbd>s</kbd>
        <kbd>d</kbd>
        to fire
      </div>
      <div css={keysStyles}>
        <kbd>↑</kbd>
        <kbd>↓</kbd>
        <kbd>→</kbd>
        <kbd>←</kbd>
        to steer
      </div>
    </div>
  );
};

export default Tips;