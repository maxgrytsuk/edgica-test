import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import format from 'date-fns/format';
import addMinutes from 'date-fns/addMinutes';
import * as AppActions from './app.actions';

const TIME_FORMAT = 'HH-mm a';
const DATE_FORMAT = 'EEEE, dd LLLL';
const TIME_OFFSET_MIN = 60;

export type ProgressType = 'In progress' | 'Done' | 'Planned';

export type ItemType = 'logbook' | 'carePlan';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  isChecked: boolean;
};

export const PROGRESS: Array<ProgressType> = ['In progress', 'Done', 'Planned'];

export interface State {
  progressIndex: number;
  currentDate: string;
  started: {
    time: string;
    isSelected: boolean;
  };
  finished: {
    time: string;
    isSelected: boolean;
  };
  itemType: ItemType;
  items: Array<Item>;
}


const ID = () => '_' + Math.random().toString(36).substr(2, 9);
;

const initialState: State = {
  progressIndex: 0,
  currentDate: format(new Date(), DATE_FORMAT),
  started: {
    time: format(new Date(), TIME_FORMAT),
    isSelected: false,
  },
  finished: {
    time: format(addMinutes(new Date(), TIME_OFFSET_MIN), TIME_FORMAT),
    isSelected: false,
  },
  itemType: 'logbook',
  items: [
    {
      id: ID(),
      type: 'logbook',
      title: 'Give water every two hours',
      description: 'Needs to drink a water every two hour',
      isChecked: false
    },
    {
      id: ID(),
      type: 'carePlan',
      title: 'Shower',
      description: 'Shower every two hours',
      isChecked: false
    }
  ]
};

const appReducer = createReducer(
  initialState,
  on(AppActions.setProgress,
    state => ({
      ...state,
      progressIndex: (state.progressIndex + 1) % PROGRESS.length
    })),
  on(AppActions.setStartedSelected,
    state => ({
      ...state,
      started: {
        ...state.started,
        isSelected: !state.started.isSelected
      }
    })),
  on(AppActions.setItemType,
    (state, { itemType }) => ({
      ...state,
      itemType
    })),
  on(AppActions.setItemChecked,
    (state, { checkedItem }) => {
      return {
        ...state,
        items: [
          ...state.items.filter(item => item.id !== checkedItem.id),
          {
            ...checkedItem,
            isChecked: !checkedItem.isChecked
          }
        ]
      }
    }),
  on(AppActions.removeItem,
    (state, { itemToRemove }) => {
      return {
        ...state,
        items: state.items.filter(item => item.id !== itemToRemove.id)
      }
    }),
  on(AppActions.setFinishedSelected,
    state => ({
      ...state,
      finished: {
        ...state.finished,
        isSelected: !state.finished.isSelected
      }
    })),
  on(AppActions.addItem,
    state => ({
      ...state,
      items: [
        ...state.items,
        {
          id: ID(),
          type: 'logbook',
          title: 'Some new item title',
          description: 'Some new item description',
          isChecked: false
        }
      ]
    })),
);

export function reducer(state: State | undefined, action: Action) {
  return appReducer(state, action);
}
