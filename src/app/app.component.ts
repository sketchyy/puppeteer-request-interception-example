import { Component, OnInit } from '@angular/core';
import { TodosService } from './todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  todos$;

  constructor(private todos: TodosService) {}

  ngOnInit() {
    this.todos$ = this.todos.getTodos();
  }

}
