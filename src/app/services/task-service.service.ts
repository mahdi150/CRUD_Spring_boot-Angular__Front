import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskInterface } from '../interfaces/task-interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
 
  private apiUrl = 'http://localhost:8886/api/task';

  constructor(private http: HttpClient) { }

  
 deleteAllTasks() : Observable<any> {
    return this.http.delete(this.apiUrl);
  }
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getAllTasks(): Observable<TaskInterface[]> {
    return this.http.get<TaskInterface[]>(this.apiUrl);
  }
}
