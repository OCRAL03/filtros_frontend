import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Articulo } from "../../articulo/entities/articulo.entity";

@Entity("condicion_producto", { schema: "sarcos_db" })
export class CondicionProducto {
  @PrimaryGeneratedColumn({ type: "int", name: "id_condicion_producto" })
  idCondicionProducto: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre: string | null;

  @OneToMany(() => Articulo, (articulo) => articulo.idCondicionProducto2)
  articulos: Articulo[];
}
