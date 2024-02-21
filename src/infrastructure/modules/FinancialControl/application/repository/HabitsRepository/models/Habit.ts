export interface Habit {
  email: string;
  type: HabitsType;
  transactionId: string;
}

export enum HabitsType {
  Habits_Alimentation = 'Habits_Alimentation',
  Habits_Vehicles = 'Habits_Vehicles',
  Habits_Restaurant = 'Habits_Restaurant',
  Habits_AntExpenses = 'Habits_AntExpenses',
}
