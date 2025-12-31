import { Component } from '@angular/core';

@Component({
  selector: 'app-home-dac',
  standalone: true,
  imports: [],
  templateUrl: './home-dac.component.html',
  styleUrl: './home-dac.component.css'
})
export class HomeDACComponent  {
welcomeName=sessionStorage.getItem('firstname')
 
 

}
