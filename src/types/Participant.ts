export interface Participant {
  id: string;
  name: string;
  availability: Set<number>[];
}
