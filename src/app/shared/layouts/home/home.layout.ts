import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    standalone: true,
    templateUrl: './home.layout.html',
    styleUrl: './home.layout.scss',
    imports: [RouterOutlet]
})
export class HomeLayoutComponent {

}