import { Token } from '../models/token.model';

export interface GetAllTokensByStatusDto {
  Status: number;
  Response: {
    content: Token[];
    PaginationInfo: {
      totalelements: number;
      totalPages: number;
      pagesize: number;
      previouspage: number;
      currentpg: number;
      nextpage: number;
    };
  };
}
