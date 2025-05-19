import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-turnos-evento',
  templateUrl: './turnos-evento.component.html',
  styleUrls: ['./turnos-evento.component.css']
})
export class TurnosEventoComponent implements OnInit {
  eventoId: string = '';
  turnos: any[] = [];

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.paramMap.get('id') || '';

    this.afs.collection('turnos', ref =>
      ref.where('eventoId', '==', this.eventoId)
    ).valueChanges({ idField: 'id' }).subscribe(data => {
      this.turnos = data;
    });
  }
}
