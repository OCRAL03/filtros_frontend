import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity";
import { CondicionProducto } from "../../condicion-producto/entities/condicion-producto.entity";
import { Marca } from "../../marca/entities/marca.entity";


@Index("fk_articulo_categoria_1", ["idCategoria"], {})
@Index("fk_articulo_marca_2", ["idMarca"], {})
@Index("fk_articulo_condicion_producto_3", ["idCondicionProducto"], {})
@Entity("articulo", { schema: "sarcos_db" })
export class Articulo {
  @PrimaryGeneratedColumn({ type: "int", name: "id_articulo" })
  idArticulo: number;

  @Column("int", { name: "id_categoria", nullable: true })
  idCategoria: number | null;

  @Column("int", { name: "id_marca", nullable: true })
  idMarca: number | null;

  @Column("varchar", { name: "modelo", nullable: true, length: 255 })
  modelo: string | null;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre: string | null;

  @Column("int", { name: "stock", nullable: true })
  stock: number | null;

  @Column("varchar", {
    name: "descripcion",
    nullable: true,
    comment: " ",
    length: 1024,
  })
  descripcion: string | null;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen: string | null;

  @Column("decimal", {
    name: "precio_compra",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  precioCompra: number | null;

  @Column("decimal", {
    name: "precio_venta",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  precioVenta: number | null;

  @Column("int", { name: "id_condicion_producto", nullable: true })
  idCondicionProducto: number | null;

  @Column("date", { name: "fecha_ingreso", nullable: true })
  fechaIngreso: string | null;

  @Column("date", { name: "garantia_fabrica", nullable: true })
  garantiaFabrica: string | null;

  @Column("int", { name: "descuento", nullable: true })
  descuento: number | null;

  @ManyToOne(() => Categoria, (categoria) => categoria.articulos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_categoria", referencedColumnName: "idCategoria" }])
  idCategoria2: Categoria;

  @ManyToOne(
    () => CondicionProducto,
    (condicionProducto) => condicionProducto.articulos,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    {
      name: "id_condicion_producto",
      referencedColumnName: "idCondicionProducto",
    },
  ])
  idCondicionProducto2: CondicionProducto;

  @ManyToOne(() => Marca, (marca) => marca.articulos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_marca", referencedColumnName: "idMarca" }])
  idMarca2: Marca;

}
