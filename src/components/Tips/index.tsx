import { css } from '@emotion/react';
import { FC } from 'react';

const keysStyles = css`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const Tips: FC = () => {
  return (
    <div>
      <div css={keysStyles}>
        <kbd>↑</kbd>
        <kbd>↓</kbd>
        <kbd>→</kbd>
        <kbd>←</kbd>
        or first finger to steer
      </div>
      <div css={keysStyles}>
        <kbd>w</kbd>
        <kbd>a</kbd>
        <kbd>s</kbd>
        <kbd>d</kbd>
        or second finger to fire
      </div>
    </div>
  );
};

export default Tips;