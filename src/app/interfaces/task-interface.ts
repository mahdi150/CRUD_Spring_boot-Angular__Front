export interface TaskInterface {
    id: number;
    title : string;
    type:string;
    description :string;
    dueDate : Date;
}

export interface CountType {
    type: string;
    count: number;
  }
