export interface Assignment {
  _id?: string;
  title: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  untilDate: string;
  course: string;
}
