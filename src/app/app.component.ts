import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CountType, TaskInterface } from './interfaces/task-interface';
import { TaskServiceService } from './services/task-service.service';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,HttpClientModule,FormsModule],
  providers:[HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  public chart: any;
  constructor(private httpClient: HttpClient) {}
  data : TaskInterface[]=[];
  filteredData: TaskInterface[] = []; // Array to hold filtered tasks

  searchQuery: string = '';
  public newTask: TaskInterface = { id :0,title: '', description: '', type: '', dueDate: new Date() };
  ngOnInit(): void {
    this.fetchData();
    this.createChart();
    this.fetchChartData();
  }

  fetchData(){
    this.httpClient.get("http://localhost:8886/api/task")
    .subscribe((data)=>{
      this.data=data  as TaskInterface[];
      //this.applySearchFilter();
     // console.log(this.data)
    })
  }
 




  searchTasks(): void {
    if (this.searchQuery.trim() !== '') {
      this.httpClient.get<TaskInterface[]>(`http://localhost:8886/api/task/search?letter=${this.searchQuery}`).subscribe(data => {
        this.data = data;
      });
    } else {
      this.fetchData(); // Fetch all tasks if search query is empty
    }
  }

  addTask(event:Event) {
    event.preventDefault();
    this.httpClient.post("http://localhost:8886/api/task", this.newTask).subscribe(() => {
      // If the task is added successfully, fetch the updated task list
      this.fetchData();
      // Reset the newTask object to clear the form
      this.newTask = { id:0,title: '', description: '', type: '', dueDate: new Date() };
    });
  }

  deleteById(id:number){
    confirm("are you sure !");
    this.httpClient.delete(`http://localhost:8886/api/task/${id}`).subscribe(
      () => {
        alert('deleted.')
      },
      (error) => {
        // Handle errors here, if needed
        console.error("Error deleting task:", error);
      }
    );
  }
  
  deleteAll(){
    this.httpClient.delete("http://localhost:8886/api/task").subscribe(()=>{
      this.data = [];
      alert("All tasks deleted!");
    })
  }

  fetchChartData() {
    this.httpClient.get<CountType[]>('http://localhost:8886/api/task/data/percentCountType').subscribe(data => {
      console.log("chart",data);
      const percentages = data.map(item => item.count); 
      console.log("percentages", percentages);
      this.updateChart(percentages);
    });
  }
  
  updateChart(percentages: number[]) {
    this.chart.data.datasets[0].data = percentages;
    this.chart.update();
  }

  createChart(){

    this.chart = new Chart("MyChart", {
      type: 'pie', 

      data: {
        labels: ['done', 'pending','todo' ],
	       datasets: [{
    label: 'My First Dataset',
    data: [],
    backgroundColor: [
       'Yellow','Orange','Red'
    ],
    hoverOffset: 4
  }],
      },
      options: {
        aspectRatio:2.5
      }

    });
  }
 
    

  title = 'taskmanagement';
}
