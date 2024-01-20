import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { IFramePageComponent } from './iframe-page/iframe-page.component';

export const routes: Routes = [
    {path: 'mainpage', component: MainPageComponent},
    {path: 'iframepage', component: IFramePageComponent}
];
