import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosService } from './shared/data-access/todos.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { intersectResults } from '@ngneat/query';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  template: `
    <!-- Async Pipe -->
    <!-- @if (todos.result$ | async; as result) {
      @if (result.isLoading) {
        <p>Loading...</p>
      }
      @if (result.isSuccess) {
       <p>{{ result.data[0].title }}</p>
      }
      @if (result.isError) {
        <p>Error</p>
      }
    } -->

    <!-- Signal -->
    <!-- @if (todos().isLoading) { 
      Loading...
    }
    @if(todos().data; as data) {
      <p>{{ data[0].title }}</p>
    }
    @if (todos().isError) {
      <p>Error</p>
    } -->

    <input #ref type="text">
    <button (click)="onAddTodo(ref.value)">Add Todo</button>

    <!-- @if (addTodo.result$ | async; as result) { -->
    <!-- @if (addTodo.result(); as result) { -->
      <!-- {{ result.isLoading }} -->
      <!-- @if (result.isPending) {
        <p>Mutation is loading</p>
      }
      @if (result.isSuccess) {
        <p>Mutation was successful</p>
      }
      @if (result.isError) {
        <p>Mutation encountered and Error</p>
      }
    } -->

    <h1>Signal Intersection</h1>
    @if (intersection(); as intersectionResult) {
     @if (intersectionResult.isLoading) {
      <p>Loading</p>
     }
     @if (intersectionResult.isSuccess) {
      <p>{{intersectionResult.data}}</p>
     }
     @if (intersectionResult.isError) {
      <p>Error</p>
     }
    }
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'angular-query-1';
  // todos = inject(TodosService).getTodos(); // Async
  todos = inject(TodosService).getTodos().result; // Signal
  #todosService = inject(TodosService);

  addTodo = inject(TodosService).addTodo();

  onAddTodo(title: string) {
    this.addTodo.mutate({ title });
    // this.addTodo.mutateAsync({ title });
  }

  intersection = intersectResults(
    [
      this.#todosService.getOneTodo(1).result,
      this.#todosService.getOneTodo(2).result,
    ],
    ([todoOne, todoTwo]) => todoOne.title + ' - - - ' + todoTwo.title
  )

  intersectionAsObject = intersectResults(
    {
      todoOne: this.#todosService.getOneTodo(1).result,
      todoTwo: this.#todosService.getOneTodo(2).result,
    },
    ({ todoOne, todoTwo }) => todoOne.title + ' - - - ' + todoTwo.title
  )
}
