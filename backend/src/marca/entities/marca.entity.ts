import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Articulo } from "../../articulo/entities/articulo.entity";

@Entity("marca", { schema: "sarcos_db" })
export class Marca {
  @PrimaryGeneratedColumn({ type: "int", name: "id_marca" })
  idMarca: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre: string | null;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen: string | null;

  @Column("varchar", { name: "condicion", nullable: true, length: 50 })
  condicion: string | null;

  @OneToMany(() => Articulo, (articulo) => articulo.idMarca2)
  articulos: Articulo[];
}
