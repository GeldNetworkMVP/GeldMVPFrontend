import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '@environments/environment';

type HttpPostParams = Parameters<typeof HttpClient.prototype.post>;
type HttpPutParams = Parameters<typeof HttpClient.prototype.put>;
type HttpGetParams = Parameters<typeof HttpClient.prototype.get>;
type HttpDeleteParams = Parameters<typeof HttpClient.prototype.delete>;
type HttpPatchParams = Parameters<typeof HttpClient.prototype.patch>;

export class BaseService {
  http = inject(HttpClient);

  get<Dto = unknown>(urlPart: HttpGetParams[0], options?: HttpGetParams[1]) {
    return this.http.get<Dto>(`${environment.apiUrl}/${urlPart}`, options);
  }

  post<Dto = unknown>(
    urlPart: HttpPostParams[0],
    data: HttpPostParams[1],
    options?: HttpPostParams[2]
  ) {
    return this.http.post<Dto>(
      `${environment.apiUrl}/${urlPart}`,
      data,
      options
    );
  }

  put<Dto = unknown>(
    urlPart: HttpPutParams[0],
    data: HttpPutParams[1],
    options: HttpPutParams[2]
  ) {
    return this.http.put<Dto>(
      `${environment.apiUrl}/${urlPart}`,
      data,
      options
    );
  }

  delete(urlPart: HttpDeleteParams[0], options: HttpDeleteParams[1]) {
    return this.http.delete(`${environment.apiUrl}/${urlPart}`, options);
  }

  patch<Dto = unknown>(
    urlPart: HttpPatchParams[0],
    data: HttpPatchParams[1],
    options: HttpPatchParams[2]
  ) {
    return this.http.patch<Dto>(
      `${environment.apiUrl}/${urlPart}`,
      data,
      options
    );
  }
}
