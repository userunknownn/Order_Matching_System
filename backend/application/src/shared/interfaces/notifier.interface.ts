export interface Notifier {
  notify(event: NotifierEvent): void | Promise<void>;
}

export interface NotifierEvent {
  type:
    | 'updateOrderBook'
    | 'updateGlobalMatches'
    | 'updateMyMatchHistory'
    | 'updateStats'
    | 'removeActiveOrder'
    | 'addActiveOrder'
    | 'updateUserBalances';
  payload: any;
  userId?: string;
}
