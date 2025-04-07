import { createBlock } from '@framework';
import { BlockInstance } from '@models';

import './Counter.scss';

type CounterProps = {
  count: number;
};

//language=hbs
const counterTemplate: string = `
<div class="counter">
  {{count}}
</div>
`;

export function createCounter(props: CounterProps): BlockInstance {
  return createBlock({
    ...props,
    render: () => counterTemplate,
  });
}
