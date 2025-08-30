import { Component, OnInit } from '@angular/core';
import { movies } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movies-landingpage.component.html',
  styleUrl: './movies-landingpage.component.scss'
})
export class MovieLandingPageComponent implements OnInit {
  dummyMoviesdata: any[] = [];
  filters: any[] = [
    {
      type: "Language",
      data: [
        { text: "Hindi", index: 0, selected: false },
        { text: "English", index: 1, selected: false },
        { text: "Gujrati", index: 2, selected: false },
        { text: "Marathi", index: 3, selected: false },
        { text: "Malayalam", index: 4, selected: false },
        { text: "Punjabi", index: 5, selected: false },
        { text: "Telugu", index: 6, selected: false }
      ]
    },
    {
      type: "Genres",
      data: [
        { text: "Drama", index: 0, selected: false },
        { text: "Action", index: 1, selected: false },
        { text: "Comedy", index: 2, selected: false },
        { text: "Thriller", index: 3, selected: false }
      ]
    },
    {
      type: "Formats",
      data: [
        { text: "2D", index: 0, selected: false },
        { text: "3D", index: 1, selected: false },
        { text: "4Dx", index: 2, selected: false },
        { text: "IMAX2d", index: 3, selected: false }
      ]
    }
  ];


  selectedFilters: any[] = [
    {
      type: "Language",
      data: []
    },
    {
       type: "Genres",
      data: []
    },
     {
      type: "Formats",
      data: []
    }
  ]
  topFiltersArray: any[] = [
    
  ]
  originalMovies = movies;
  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
  }



ngOnInit():void{
 this.topFiltersArray=this.filters.filter((item:any)=> {
    if(item.type=='Language') return item.data.filter((i:any)=>i)
    } )
  
  
}

handleEventFilter(filter: any) {
  // make selected filter appear background red
  this.filters.filter((item:any)=>{
    if(item.type== filter.type){
      item.data.filter((i:any)=>{
        if(i.text==filter.filterName.text){
          i.selected=!i.selected
        }
        
      })
    }
    
  }
)
// push selected filter in selectedFiltersArray
let filterType:any[]=this.selectedFilters.filter((item:any)=>
  item.type==filter.type
)
    if(filterType){
      let alreayExist=filterType[0].data.filter((i:any)=>i.text== filter.filterName.text)
      if(alreayExist.length==0){
        filterType[0].data.push(filter.filterName)
        return filterType[0].data.sort((a:any,b:any)=>a.index-b.index)
      }
      else{
        filterType[0].data=filterType[0].data.filter((i:any)=>i.text!=filter.filterName.text)
        
      }
      
    }
    
  }
  
    
  

}
