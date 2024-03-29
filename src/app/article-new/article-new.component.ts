

import * as firebase2 from 'firebase';
import { firebase } from '@firebase/app';
import { Component, OnInit, Input , ElementRef, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import { Observable ,  Subject ,  of } from 'rxjs';
import { MainService } from '../_services/main.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import {ProfileService}from '../_services/profile.service'

import { AngularFirestore } from 'angularfire2/firestore';
import PlantifyUser from '../schema/user';

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.css']
})
export class ArticleNewComponent implements OnInit {
  title ="";
article_data ="";
description="";
userId: string;
  me: boolean;



user = new PlantifyUser;
author="";
isLoggedIn:boolean
loading:boolean;
visible: boolean = true;
selectable: boolean = true;
removable: boolean = true;
addOnBlur: boolean = false;

separatorKeysCodes = [ENTER, COMMA];

tagCtrl = new FormControl();

filteredTags: Observable<any[]>;


tags = [
];

allTags = [
  'computers',
  'writing',
  'accounting',
  'angular',
  'android-developement',
  'ios-developement0',
  'maths',
  'physics',
  'digital-logic-design',
  'health',
  'medical-sciences'
];

@ViewChild('tagInput') tagInput: ElementRef;

constructor(public mainService:MainService,
  private db: AngularFirestore,
  public authService:AuthService,
  private router: Router,
  private route: ActivatedRoute,
  private profileService: ProfileService,
  ) {


 }

add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;

  // Add our tag
  if ((value || '').trim()) {
    this.tags.push(value.trim());
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }

  this.tagCtrl.setValue(null);
}

remove(tag: any): void {
  const index = this.tags.indexOf(tag);

  if (index >= 0) {
    this.tags.splice(index, 1);
  }
}

filter(name: string) {
  return this.allTags.filter(tag =>
      tag.toLowerCase().indexOf(name.toLowerCase()) === 0);
}

selected(event: MatAutocompleteSelectedEvent): void {
  this.tags.push(event.option.viewValue);
  this.tagInput.nativeElement.value = '';
  this.tagCtrl.setValue(null);
}
simplemdeoptions : any ={
  // autofocus: true,
  autoDownloadFontAwesome:true,
  autosave: {
    enabled: true,
    uniqueId: "MyUniqueID",
    delay: 1000,
  },
  // element: document.getElementById("MyID"),
  forceSync: true,
  // hideIcons: ["guide", "heading"],
  // indentWithTabs: false,
  // initialValue: "Hello world!",
  // lineWrapping: false,
  placeholder: "Description here...",
  promptURLs: true,
  // renderingConfig: {
  // 	singleLineBreaks: false,
  // 	codeSyntaxHighlighting: true,
  // },
  shortcuts: {
    drawTable: "Cmd-Alt-T"
  },
  showIcons: ["code"],
  // spellChecker: true,
  styleSelectedText: false,
  tabSize: 4,
  // toolbar: [{
  //         name: "bold",
  //         action: "toggleBold",
  //         className: "fa fa-bold",
  //         title: "Bold (Ctrl+B)",
  //     },
  //     "|"
  // ],
  // toolbar: true,
  // toolbarTips: true,
};


  
ngOnInit() {

  
  this.authService.getLoggedInUpdates().subscribe(user=> {
    if(user==null || user==undefined){
      this.isLoggedIn = false;
    }
    else {
      this.isLoggedIn = true;
    }
});
this.userId = this.route.snapshot.paramMap.get('id');



this.authService.getCurrentUserUpdates().subscribe((user) => {

  if (!user) {
    return;
  }
  if (user.id === this.userId || !this.userId) {
    this.me = true;
    
  } else {
    this.getUser();
    this.me = false;
  }

  this.user = user;
  


});





}


getUser() {
this.loading = true;
this.profileService.getById(this.userId)
  .then(user => {
    this.user = <PlantifyUser>user;
  //  console.log(user);

    this.loading = false;
  })
  .catch(err => {
    this.loading = false;
  });
}






  
posting(){
  var addDoc =this.db.collection('articles').add({
    title: this.title,
    description: this.description,
    tags: this.tags,
    author:this.user.displayName,
    authorId:this.user.id

  }).then(ref => {
    console.log('Added document with ID: ', ref.id);
    var addid=this.db.collection('articles').doc(ref.id).update({
      id: ref.id
    })
    console.log(' the first tag is ',this.tags[0]);
    console.log('the id of author is',this.user.id);
    this.router.navigateByUrl('/');
      
});
  
}
}


