import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    standalone: true,
    templateUrl: './home.layout.html',
    styleUrl: './home.layout.scss',
    imports: [RouterOutlet, RouterLink]
})
export class HomeLayoutComponent {

}