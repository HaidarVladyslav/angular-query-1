import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient, queryOptions } from '@ngneat/query';
import { Todos } from '../interfaces/todos';
import { tap } from 'rxjs';

// function groupOptions() {
//   return queryOptions({
//     queryKey: ['groups'] as const,
//     queryFn: fetchFunc,
//     staleTime: 5 * 1000
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  #http = inject(HttpClient);
  #queryClient = injectQueryClient();
  #query = injectQuery();
  #mutation = injectMutation();

  getTodos() {
    return this.#query({
      queryKey: ['todos'] as const,
      queryFn: () => this.#http.get<Todos[]>('https://jsonplaceholder.typicode.com/todos?_limit=20'),
      // staleTime: 5 * 1000
    });
  }

  addTodo() {
    return this.#mutation({
      mutationFn: ({ title }: { title: string }) => this.#http.post<Todos>(`https://jsonplaceholder.typicode.com/todos`, { title })
    })
  }

  getOneTodo(id: number) {
    return this.#query({
      queryKey: ['todo'] as const,
      queryFn: () => this.#http.get<Todos>(`https://jsonplaceholder.typicode.com/todos/${id}`).pipe(tap(console.log))
    })
  }
}
