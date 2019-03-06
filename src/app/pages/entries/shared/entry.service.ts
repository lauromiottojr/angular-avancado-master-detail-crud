import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

	private apiPath: string = "api/entries";

  constructor(private http: HttpClient) {  }
  	getAll(): Observable<Entry[]>{
  		return this.http.get(this.apiPath).pipe(
  			catchError(this.hanbleError),
  			map(this.jsonDataToEntries)
  		)
  }

  getById(id: Number): Observable<Entry>{
  	const url = `${this.apiPath}/${id}`;
  	return this.http.get(url).pipe(
  		catchError(this.hanbleError),
  		map(this.jsonDataToEntry)
  	)
  }

  create(entry: Entry): Observable<Entry>{
  	return this.http.post(this.apiPath, entry).pipe(
  		catchError(this.hanbleError),
  		map(this.jsonDataToEntry)
  	)
  }

  update(entry: Entry): Observable<Entry>{
  	const url = `${this.apiPath}/${entry.id}`;
  	return this.http.put(url, entry).pipe(
  		catchError(this.hanbleError),
  		map(() => entry)  		
  	)
  }

  delete(id: number): Observable<any>{
  const url = `${this.apiPath}/${id}`;
  	return this.http.delete(url).pipe(
  		catchError(this.hanbleError),
  		map(() => null)  
  	)
  }

  //PRIVATE METHODS

  private jsonDataToEntries(jsonData: any[]): Entry[]{
  	const entries: Entry[] = [];
    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    })
  	return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry{
    return Object.assign(new Entry(), jsonData);
  }

  private hanbleError(error: any): Observable<any>{
  	console.log("ERRO NA REQUISICAO => ", error);
  	return throwError(error);
  }


}
