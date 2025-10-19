import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Articulo } from "../../articulo/entities/articulo.entity";

@Entity("categoria", { schema: "sarcos_db" })
export class Categoria {
  @PrimaryGeneratedColumn({ type: "int", name: "id_categoria" })
  idCategoria: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre: string | null;

  @Column("varchar", { name: "descripcion", nullable: true, length: 255 })
  descripcion: string | null;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen: string | null;

  @Column("varchar", { name: "condicion", nullable: true, length: 255 })
  condicion: string | null;

  @OneToMany(() => Articulo, (articulo) => articulo.idCategoria2)
  articulos: Articulo[];
}
