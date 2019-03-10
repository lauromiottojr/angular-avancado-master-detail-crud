import { BaseResourceModel } from "../models/base-resource.model";

import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> { 			//RETORNA UM ARRAY DO OBJ CATEGORIA
    return this.http.get(this.apiPath).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.hanbleError)
    )
  }

  getById(id: Number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.hanbleError)
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.hanbleError)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.http.put(url, resource).pipe(
      map(() => resource),
      catchError(this.hanbleError)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.hanbleError)
    )
  }

  //PROTECTED METHODS

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element)));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected hanbleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISICAO => ", error);
    return throwError(error);
  }

}
