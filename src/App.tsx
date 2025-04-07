import { FC } from 'react';
import Game from '@/components/Game';
import Tips from '@/components/Tips';

const App: FC = () => {
  return (
    <div>
      <Game />
      <div css={{ position: 'absolute', right: 10, bottom: 10 }}>
        <Tips />
      </div>
    </div>
  );
};

export default App;