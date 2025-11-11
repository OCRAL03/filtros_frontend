-- phpMyAdmin SQL Dump
-- Base de datos: `sarcos_db`
-- --------------------------------------------------------
DROP DATABASE IF EXISTS `sarcos_db`;
CREATE DATABASE IF NOT EXISTS `sarcos_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sarcos_db`;
-- Limpieza opcional: eliminar tablas existentes para reconstrucción sin borrar la base completa
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `accion`;
DROP TABLE IF EXISTS `agenda`;
DROP TABLE IF EXISTS `cargo`;
DROP TABLE IF EXISTS `categoria`;
DROP TABLE IF EXISTS `cliente`;
DROP TABLE IF EXISTS `comprobante`;
DROP TABLE IF EXISTS `condicion_producto`;
DROP TABLE IF EXISTS `credito`;
DROP TABLE IF EXISTS `detalle_credito`;
DROP TABLE IF EXISTS `detalle_separado`;
DROP TABLE IF EXISTS `detalle_venta`;
DROP TABLE IF EXISTS `documento`;
DROP TABLE IF EXISTS `egreso`;
DROP TABLE IF EXISTS `estado_cliente`;
DROP TABLE IF EXISTS `estado_credito`;
DROP TABLE IF EXISTS `estado_venta`;
DROP TABLE IF EXISTS `garantia`;
DROP TABLE IF EXISTS `ingreso`;
DROP TABLE IF EXISTS `marca`;
DROP TABLE IF EXISTS `metodo_pago`;
DROP TABLE IF EXISTS `modulo`;
DROP TABLE IF EXISTS `pago_credito`;
DROP TABLE IF EXISTS `pago_separado`;
DROP TABLE IF EXISTS `penalidades`;
DROP TABLE IF EXISTS `permiso`;
DROP TABLE IF EXISTS `plan_pago`;
DROP TABLE IF EXISTS `producto`;
DROP TABLE IF EXISTS `producto_color`;
DROP TABLE IF EXISTS `color`;
DROP TABLE IF EXISTS `producto_tienda`;
DROP TABLE IF EXISTS `producto_tipo_producto`;
DROP TABLE IF EXISTS `rol`;
DROP TABLE IF EXISTS `rol_permiso`;
DROP TABLE IF EXISTS `separado`;
DROP TABLE IF EXISTS `servicio`;
DROP TABLE IF EXISTS `sub_categoria`;
DROP TABLE IF EXISTS `sub_categoria_tipo_producto`;
DROP TABLE IF EXISTS `ticket_credito`;
DROP TABLE IF EXISTS `tienda`;
DROP TABLE IF EXISTS `tipo_producto`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `usuario`;
DROP TABLE IF EXISTS `usuario_permiso`;
DROP TABLE IF EXISTS `usuario_rol`;
DROP TABLE IF EXISTS `venta`;
-- Mantener deshabilitadas las FKs durante la creación; se habilitan al final del archivo
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Estructura de tabla para la tabla `accion`
--

CREATE TABLE `accion` (
  `id_accion` int NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `accion`
--

INSERT INTO `accion` (`id_accion`, `nombre`) VALUES
(1, 'ver'),
(2, 'crear'),
(3, 'editar'),
(4, 'eliminar');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `accion`
--
ALTER TABLE `accion`
  ADD PRIMARY KEY (`id_accion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `accion`
--
ALTER TABLE `accion`
  MODIFY `id_accion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

--
-- Estructura de tabla para la tabla `agenda`
--

CREATE TABLE `agenda` (
  `id` int NOT NULL,
  `titulo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `tipo_tarea` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '#007bff',
  `id_usuario` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_fecha` (`fecha`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_fecha_hora` (`fecha`,`hora`),
  ADD KEY `idx_tipo_tarea` (`tipo_tarea`),
  ADD KEY `idx_estado` (`estado`);

--
-- AUTO_INCREMENT de la tabla `agenda`
--
ALTER TABLE `agenda`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `agenda`
--
-- FK a `usuario` movido al final para evitar error 1824
-- ALTER TABLE `agenda`
--   ADD CONSTRAINT `FK_31b61efe8dab28bfdb4c5d13eac` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `id_cargo` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`id_cargo`, `nombre`) VALUES
(1, 'Administrador'),
(2, 'Gerente'),
(3, 'test');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`id_cargo`);

--
-- AUTO_INCREMENT de la tabla `cargo`
--
ALTER TABLE `cargo`
  MODIFY `id_cargo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL,
  `nombre` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`, `estado`) VALUES
(1, 'Tecnología', 1),
(2, 'Línea Blanca', 1),
(3, 'Hogar', 1),
(4, 'Dormitorio', 1),
(5, 'Muebles', 1),
(6, 'Oficina', 1),
(7, 'Cuidado personal', 1),
(8, 'Entretenimiento', 1),
(9, 'Motos', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_documento` int DEFAULT NULL,
  `numero_documento` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referencia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_dni` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_estado_cliente` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `IDX_a5af6605e6350b484a54f3dd8f` (`numero_documento`),
  ADD KEY `fk_cliente_documento_1` (`id_documento`),
  ADD KEY `fk_cliente_estado_cliente_2` (`id_estado_cliente`);

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int NOT NULL AUTO_INCREMENT;

--
-- FKs hacia `estado_cliente` y `documento` movidas al bloque final para garantizar índices existentes
-- ALTER TABLE `cliente`
--   ADD CONSTRAINT `FK_315b6f01dbaacfc460c1fbc38d5` FOREIGN KEY (`id_estado_cliente`) REFERENCES `estado_cliente` (`id_estado`),
--   ADD CONSTRAINT `FK_c43220e4d77c03f8428f5d5cbdb` FOREIGN KEY (`id_documento`) REFERENCES `documento` (`id_documento`);
COMMIT;

--
-- Estructura de tabla para la tabla `color`
--

CREATE TABLE `color` (
  `id_color` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo_hex` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `color`
--

INSERT INTO `color` (`id_color`, `nombre`, `codigo_hex`) VALUES
(1, 'Negro', '#000000'),
(2, 'Blanco', '#FFFFFF'),
(3, 'Gris', '#808080'),
(4, 'Plateado', '#C0C0C0'),
(5, 'Azul', '#0066CC'),
(6, 'Rojo', '#DC143C'),
(7, 'Verde', '#00AA00'),
(8, 'Amarillo', '#FFD700'),
(9, 'Rosa', '#FF69B4'),
(10, 'Dorado', '#FFD700'),
(11, 'Naranja', '#FF8C00'),
(12, 'Morado', '#8B00FF'),
(13, 'Café', '#8B4513'),
(14, 'Turquesa', '#40E0D0'),
(15, 'Beige', '#F5F5DC');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`id_color`);

--
-- AUTO_INCREMENT de la tabla `color`
--
ALTER TABLE `color`
  MODIFY `id_color` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

--
-- Estructura de tabla para la tabla `comprobante`
--

CREATE TABLE `comprobante` (
  `id_comprobante` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `comprobante`
--

INSERT INTO `comprobante` (`id_comprobante`, `nombre`) VALUES
(1, 'Boleta'),
(2, 'Factura'),
(3, 'Boleta simple');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comprobante`
--
ALTER TABLE `comprobante`
  ADD PRIMARY KEY (`id_comprobante`);

--
-- AUTO_INCREMENT de la tabla `comprobante`
--
ALTER TABLE `comprobante`
  MODIFY `id_comprobante` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

--
-- Estructura de tabla para la tabla `condicion_producto`
--

CREATE TABLE `condicion_producto` (
  `id_condicion_producto` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `condicion_producto`
--

INSERT INTO `condicion_producto` (`id_condicion_producto`, `nombre`) VALUES
(1, 'En stock'),
(2, 'Sin stock'),
(3, 'Descontinuado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `condicion_producto`
--
ALTER TABLE `condicion_producto`
  ADD PRIMARY KEY (`id_condicion_producto`);

--
-- AUTO_INCREMENT de la tabla `condicion_producto`
--
ALTER TABLE `condicion_producto`
  MODIFY `id_condicion_producto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

--
-- Estructura de tabla para la tabla `credito`
--

CREATE TABLE `credito` (
  `id_credito` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_cliente_garante` int DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `num_cuotas` int DEFAULT NULL,
  `num_cuotas_restante` int DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  `id_estado_credito` int DEFAULT NULL,
  `garantia_extendida_credito` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `garantia_tienda` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `periodo_pago` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interes` decimal(20,2) DEFAULT NULL,
  `inicial` decimal(20,2) DEFAULT NULL,
  `monto_cuota` decimal(20,2) DEFAULT NULL,
  `monto_deuda` decimal(20,2) DEFAULT NULL,
  `monto_deuda_base` decimal(20,2) DEFAULT NULL,
  `monto_deuda_restante` decimal(20,2) DEFAULT NULL,
  `id_comprobante` int DEFAULT NULL,
  `registrar` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `justificacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `credito`
--
ALTER TABLE `credito`
  ADD PRIMARY KEY (`id_credito`),
  ADD KEY `fk_credito_estado_credito_2` (`id_estado_credito`),
  ADD KEY `fk_credito_cliente_3` (`id_cliente_garante`),
  ADD KEY `fk_credito_cliente_4` (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_metodo_pago` (`id_metodo_pago`),
  ADD KEY `fk_credito_comprobante` (`id_comprobante`),
  ADD KEY `id_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `credito`
--
ALTER TABLE `credito`
  MODIFY `id_credito` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `credito`
--
ALTER TABLE `credito`
  ADD CONSTRAINT `FK_048e585033b12996cef7c4fcc80` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobante` (`id_comprobante`),
  -- ADD CONSTRAINT `FK_5d9a8a20e81db7d77c7ffcac9b1` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`),
  ADD CONSTRAINT `FK_a41d537c6ffb05852d41cba56eb` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  -- ADD CONSTRAINT `FK_a7bff996ee3c38b10013d115f40` FOREIGN KEY (`id_estado_credito`) REFERENCES `estado_credito` (`id_estado_credito`),
  -- ADD CONSTRAINT `FK_eefc99912239d558fe18b13f63c` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
  ADD CONSTRAINT `FK_f2cbefa232ba8d01245a6c0bcac` FOREIGN KEY (`id_cliente_garante`) REFERENCES `cliente` (`id_cliente`);
COMMIT;

--
-- Estructura de tabla para la tabla `detalle_credito`
--

CREATE TABLE `detalle_credito` (
  `id_detalle_credito` int NOT NULL,
  `id_credito` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `serie` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descuento` decimal(20,2) DEFAULT NULL,
  `monto_total` decimal(20,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_credito`
--
ALTER TABLE `detalle_credito`
  ADD PRIMARY KEY (`id_detalle_credito`),
  ADD KEY `fk_detalle_credito_credito_1` (`id_credito`),
  ADD KEY `fk_detalle_credito_producto_2` (`id_producto`);

--
-- AUTO_INCREMENT de la tabla `detalle_credito`
--
ALTER TABLE `detalle_credito`
  MODIFY `id_detalle_credito` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `detalle_credito`
--
ALTER TABLE `detalle_credito`
  -- ADD CONSTRAINT `FK_9daef3e4d7074366b7030c4ac0c` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `FK_d6a468ba5b82710b29a3838b06b` FOREIGN KEY (`id_credito`) REFERENCES `credito` (`id_credito`);
COMMIT;

--
-- Estructura de tabla para la tabla `detalle_separado`
--

CREATE TABLE `detalle_separado` (
  `id_detalle_separado` int NOT NULL,
  `id_separado` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `serie` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descuento` decimal(20,2) DEFAULT NULL,
  `monto_total` decimal(20,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_separado`
--
ALTER TABLE `detalle_separado`
  ADD PRIMARY KEY (`id_detalle_separado`),
  ADD KEY `fk_detalle_separado_separado_1` (`id_separado`),
  ADD KEY `fk_detalle_separado_producto_2` (`id_producto`);

--
-- AUTO_INCREMENT de la tabla `detalle_separado`
--
ALTER TABLE `detalle_separado`
  MODIFY `id_detalle_separado` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `detalle_separado`
--
-- ALTER pospuesto: claves foráneas se agregan al final del archivo
-- ALTER TABLE `detalle_separado`
--   ADD CONSTRAINT `FK_2c5c0b4e5d6e7f8a9b0c1d2e3f4` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
--   ADD CONSTRAINT `FK_3d6d1c5e6f7a8b9c0d1e2f3a4b5` FOREIGN KEY (`id_separado`) REFERENCES `separado` (`id_separado`);
COMMIT;

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_detalle_venta` int NOT NULL,
  `id_venta` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `serie` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descuento` decimal(20,2) DEFAULT NULL,
  `monto_total` decimal(20,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalle_venta`),
  ADD KEY `fk_detalle_venta_venta_1` (`id_venta`),
  ADD KEY `fk_detalle_venta_producto_2` (`id_producto`);

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle_venta` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `detalle_venta`
--
-- ALTER TABLE `detalle_venta`
  -- ADD CONSTRAINT `FK_4e7e2d6f7a8b9c0d1e2f3a4b5c6` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  -- ADD CONSTRAINT `FK_5f8f3e7g8b9c0d1e2f3a4b5c6d7` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`);
COMMIT;

--
-- Estructura de tabla para la tabla `documento`
--

CREATE TABLE `documento` (
  `id_documento` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `documento`
--

INSERT INTO `documento` (`id_documento`, `nombre`) VALUES
(1, 'SIN DOCUMENTO'),
(2, 'DNI'),
(3, 'CARNET');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `documento`
--
ALTER TABLE `documento`
  ADD PRIMARY KEY (`id_documento`);

--
-- AUTO_INCREMENT de la tabla `documento`
--
ALTER TABLE `documento`
  MODIFY `id_documento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

--
-- Estructura de tabla para la tabla `egreso`
--

CREATE TABLE `egreso` (
  `id_egreso` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monto_egreso` decimal(20,2) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `egreso`
--
ALTER TABLE `egreso`
  ADD PRIMARY KEY (`id_egreso`),
  ADD KEY `fk_egreso_usuario_1` (`id_usuario`),
  ADD KEY `fk_egreso_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `egreso`
--
ALTER TABLE `egreso`
  MODIFY `id_egreso` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `egreso`
--
-- ALTER TABLE `egreso`
--   ADD CONSTRAINT `FK_26b54ab4599a0a918dc25fbe6f7` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`)
--   -- ADD CONSTRAINT `FK_28314f48109e9e4222215887550` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
-- ;
COMMIT;

--
-- Estructura de tabla para la tabla `estado_cliente`
--

CREATE TABLE `estado_cliente` (
  `id_estado` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estado_cliente`
--

INSERT INTO `estado_cliente` (`id_estado`, `nombre`) VALUES
(1, 'Regular'),
(2, 'Deudor'),
(3, 'Moroso'),
(4, 'Inactivo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estado_cliente`
--
ALTER TABLE `estado_cliente`
  ADD PRIMARY KEY (`id_estado`);

--
-- AUTO_INCREMENT de la tabla `estado_cliente`
--
ALTER TABLE `estado_cliente`
  MODIFY `id_estado` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

--
-- Estructura de tabla para la tabla `estado_credito`
--

CREATE TABLE `estado_credito` (
  `id_estado_credito` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estado_credito`
--

INSERT INTO `estado_credito` (`id_estado_credito`, `nombre`) VALUES
(1, 'Activo'),
(2, 'Terminado'),
(3, 'Atrasado'),
(4, 'Anulado'),
(5, 'Excedido'),
(6, 'Adelantado'),
(7, 'Justificado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estado_credito`
--
ALTER TABLE `estado_credito`
  ADD PRIMARY KEY (`id_estado_credito`);

--
-- AUTO_INCREMENT de la tabla `estado_credito`
--
ALTER TABLE `estado_credito`
  MODIFY `id_estado_credito` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

--
-- Estructura de tabla para la tabla `estado_venta`
--

CREATE TABLE `estado_venta` (
  `id_estado_venta` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estado_venta`
--

INSERT INTO `estado_venta` (`id_estado_venta`, `nombre`) VALUES
(1, 'Activo'),
(2, 'Anulado'),
(3, 'Reembolsado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estado_venta`
--
ALTER TABLE `estado_venta`
  ADD PRIMARY KEY (`id_estado_venta`);

--
-- AUTO_INCREMENT de la tabla `estado_venta`
--
ALTER TABLE `estado_venta`
  MODIFY `id_estado_venta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

--
-- Estructura de tabla para la tabla `garantia`
--

CREATE TABLE `garantia` (
  `id_garantia` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fecha_ingreso` date NOT NULL,
  `fecha_devolucion` date DEFAULT NULL,
  `estado` enum('pendiente','en_proceso','finalizado','cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `garantia`
--
ALTER TABLE `garantia`
  ADD PRIMARY KEY (`id_garantia`) USING BTREE,
  ADD KEY `FK_garantia_usuario` (`id_usuario`),
  ADD KEY `FK_garantia_cliente` (`id_cliente`),
  ADD KEY `FK_garantia_producto` (`id_producto`),
  ADD KEY `FK_garantia_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `garantia`
--
ALTER TABLE `garantia`
  MODIFY `id_garantia` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `garantia`
--
ALTER TABLE `garantia`
  -- ADD CONSTRAINT `FK_10cc628143984c1b2c7a8116733` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
  -- ADD CONSTRAINT `FK_7be54a96a6f88306b06f33f650a` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `FK_e654ceb1bd706f379f9e5cff348` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`)
  -- ADD CONSTRAINT `FK_f39ff499d92b930ce2f5b41b22a` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
;
COMMIT;

--
-- Estructura de tabla para la tabla `ingreso`
--

CREATE TABLE `ingreso` (
  `id_ingreso` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `tipo_ingreso` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monto_ingreso` decimal(20,2) DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `numero_comprobante` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD PRIMARY KEY (`id_ingreso`),
  ADD KEY `fk_ingreso_usuario_1` (`id_usuario`),
  ADD KEY `fk_ingreso_metodo_pago_2` (`id_metodo_pago`),
  ADD KEY `fk_ingreso_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  MODIFY `id_ingreso` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `ingreso`
--
-- ALTER TABLE `ingreso`
  -- ADD CONSTRAINT `FK_211c6bad5bd56f84241b425ddfc` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`),
  -- ADD CONSTRAINT `FK_d26e350a1ab05d2b4fb5af8423f` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);
COMMIT;

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_marca` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `logo` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_marca`);

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_marca` int NOT NULL AUTO_INCREMENT;
COMMIT;

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id_metodo_pago` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id_metodo_pago`, `nombre`) VALUES
(1, 'Efectivo'),
(2, 'Yape / Plin'),
(3, 'Transferencia');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id_metodo_pago`);

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id_metodo_pago` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

--
-- Estructura de tabla para la tabla `modulo`
--

CREATE TABLE `modulo` (
  `id_modulo` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `modulo`
--

INSERT INTO `modulo` (`id_modulo`, `nombre`, `descripcion`) VALUES
(1, 'Escritorio', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`id_modulo`);

--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id_modulo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

--
-- Estructura de tabla para la tabla `pago_credito`
--

CREATE TABLE `pago_credito` (
  `id_pago_credito` int NOT NULL,
  `id_plan_pago` int DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `monto_pago` decimal(20,2) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `num_comprobante` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deuda_restante` decimal(20,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pago_credito`
--
ALTER TABLE `pago_credito`
  ADD PRIMARY KEY (`id_pago_credito`),
  ADD KEY `id_plan_pago` (`id_plan_pago`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_metodo_pago` (`id_metodo_pago`),
  ADD KEY `fk_pago_credito_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `pago_credito`
--
ALTER TABLE `pago_credito`
  MODIFY `id_pago_credito` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `pago_credito`
--
ALTER TABLE `pago_credito`
  -- ADD CONSTRAINT `FK_4d531bd9c2d0b23392df5f92a29` FOREIGN KEY (`id_plan_pago`) REFERENCES `plan_pago` (`id_plan_pago`),
  -- ADD CONSTRAINT `FK_6a9413c04f25fc4809760318e39` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
  ADD CONSTRAINT `FK_c622d91252dcdaad084599a89e3` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`)
  -- ADD CONSTRAINT `FK_c92dd27080617301cccce6f222c` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
;
COMMIT;

--
-- Estructura de tabla para la tabla `pago_separado`
--

CREATE TABLE `pago_separado` (
  `id_pago_separado` int NOT NULL,
  `id_separado` int DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `monto_pago` decimal(20,2) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `num_comprobante` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deuda_restante` decimal(20,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pago_separado`
--
ALTER TABLE `pago_separado`
  ADD PRIMARY KEY (`id_pago_separado`),
  ADD KEY `id_separado` (`id_separado`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_metodo_pago` (`id_metodo_pago`),
  ADD KEY `fk_pago_separado_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `pago_separado`
--
ALTER TABLE `pago_separado`
  MODIFY `id_pago_separado` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `pago_separado`
--
-- ALTER TABLE `pago_separado`
  -- ADD CONSTRAINT `FK_7e642ce0d3e4f5a6b7c8d9e0f1a2` FOREIGN KEY (`id_separado`) REFERENCES `separado` (`id_separado`),
  -- ADD CONSTRAINT `FK_8b753df1e4f5a6b7c8d9e0f1a2b3` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
  -- ADD CONSTRAINT `FK_d733ef2f5a6b7c8d9e0f1a2b3c4` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`),
  -- ADD CONSTRAINT `FK_e844fg6a7b8c9d0e1f2a3b4c5d6` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

--
-- Estructura de tabla para la tabla `penalidades`
--

CREATE TABLE `penalidades` (
  `id_penalidad` int NOT NULL,
  `id_credito` int DEFAULT NULL,
  `fecha_penalidad` date DEFAULT NULL,
  `monto_penalidad` decimal(20,2) DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `penalidades`
--
ALTER TABLE `penalidades`
  ADD PRIMARY KEY (`id_penalidad`),
  ADD KEY `id_credito` (`id_credito`);

--
-- AUTO_INCREMENT de la tabla `penalidades`
--
ALTER TABLE `penalidades`
  MODIFY `id_penalidad` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `penalidades`
--
ALTER TABLE `penalidades`
  ADD CONSTRAINT `FK_9f955gh7i8j9k0l1m2n3o4p5q6` FOREIGN KEY (`id_credito`) REFERENCES `credito` (`id_credito`);
COMMIT;

--
-- Estructura de tabla para la tabla `plan_pago`
--

CREATE TABLE `plan_pago` (
  `id_plan_pago` int NOT NULL,
  `id_credito` int DEFAULT NULL,
  `fecha_programada` date DEFAULT NULL,
  `num_cuota` int DEFAULT NULL,
  `monto_cuota` decimal(20,2) DEFAULT NULL,
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `plan_pago`
--
ALTER TABLE `plan_pago`
  ADD PRIMARY KEY (`id_plan_pago`) USING BTREE,
  ADD KEY `id_credito` (`id_credito`);

--
-- AUTO_INCREMENT de la tabla `plan_pago`
--
ALTER TABLE `plan_pago`
  MODIFY `id_plan_pago` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `plan_pago`
--
ALTER TABLE `plan_pago`
  ADD CONSTRAINT `FK_9bf07ec07f48b3c741e3338a4c7` FOREIGN KEY (`id_credito`) REFERENCES `credito` (`id_credito`);
COMMIT;

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_marca` int DEFAULT NULL,
  `descripcion` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT ' ',
  `stock` int NOT NULL DEFAULT '0',
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio_tope` decimal(10,2) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `fecha_ingreso` date DEFAULT NULL,
  `garantia_fabrica` date DEFAULT NULL,
  `descuento` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`) USING BTREE,
  ADD KEY `idx_producto_marca` (`id_marca`),
  ADD FULLTEXT KEY `idx_search_fulltext` (`nombre`,`modelo`,`descripcion`);

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_marca` FOREIGN KEY (`id_marca`) REFERENCES `marca` (`id_marca`);
COMMIT;

--
-- Estructura de tabla para la tabla `producto_color`
--

CREATE TABLE `producto_color` (
  `id_producto_color` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_color` int NOT NULL,
  `stock` int DEFAULT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `producto_color`
--
ALTER TABLE `producto_color`
  ADD PRIMARY KEY (`id_producto_color`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_color` (`id_color`);

--
-- AUTO_INCREMENT de la tabla `producto_color`
--
ALTER TABLE `producto_color`
  MODIFY `id_producto_color` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Filtros para la tabla `producto_color`
--
ALTER TABLE `producto_color`
  ADD CONSTRAINT `producto_color_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `producto_color_ibfk_2` FOREIGN KEY (`id_color`) REFERENCES `color` (`id_color`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

--
-- Estructura de tabla para la tabla `producto_tienda`
--

CREATE TABLE `producto_tienda` (
  `id_producto_tienda` int NOT NULL,
  `id_producto` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `producto_tienda`
--
ALTER TABLE `producto_tienda`
  ADD PRIMARY KEY (`id_producto_tienda`) USING BTREE,
  ADD KEY `FK_producto_tienda_tienda` (`id_tienda`),
  ADD KEY `FK_producto_tienda_producto` (`id_producto`) USING BTREE;

--
-- AUTO_INCREMENT de la tabla `producto_tienda`
--
ALTER TABLE `producto_tienda`
  MODIFY `id_producto_tienda` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `producto_tienda`
--
ALTER TABLE `producto_tienda`
  -- ADD CONSTRAINT `FK_6de564616cd9b19d1703f5281a3` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
  ADD CONSTRAINT `FK_822fbee3b3e2b7e8419aa185671` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);
COMMIT;

--
-- Estructura de tabla para la tabla `producto_tipo_producto`
--

CREATE TABLE `producto_tipo_producto` (
  `id_producto_tipo_producto` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_tipo_producto` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `producto_tipo_producto`
--
ALTER TABLE `producto_tipo_producto`
  ADD PRIMARY KEY (`id_producto_tipo_producto`) USING BTREE,
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_tipo_producto` (`id_tipo_producto`);

--
-- AUTO_INCREMENT de la tabla `producto_tipo_producto`
--
ALTER TABLE `producto_tipo_producto`
  MODIFY `id_producto_tipo_producto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Filtros para la tabla `producto_tipo_producto`
--
-- ALTER TABLE `producto_tipo_producto`
  -- ADD CONSTRAINT `FK_producto_tipo_producto_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  -- ADD CONSTRAINT `FK_producto_tipo_producto_tipo_producto` FOREIGN KEY (`id_tipo_producto`) REFERENCES `tipo_producto` (`id_tipo_producto`);
-- Unicidad de entidades y relaciones principales
-- MOVIDO AL FINAL: las claves únicas se aplican cuando todas las tablas existen
-- ALTER TABLE `categoria` ADD UNIQUE KEY `uk_categoria_nombre` (`nombre`);
-- ALTER TABLE `sub_categoria` ADD UNIQUE KEY `uk_sub_categoria_cat_nombre` (`id_categoria`,`nombre`);
-- ALTER TABLE `tipo_producto` ADD UNIQUE KEY `uk_tipo_producto_nombre` (`nombre`);
-- ALTER TABLE `sub_categoria_tipo_producto` ADD UNIQUE KEY `uk_subcat_tipo` (`id_sub_categoria`,`id_tipo_producto`);
-- -- Garantiza una sola clasificación de tipo por producto
-- ALTER TABLE `producto_tipo_producto` ADD UNIQUE KEY `uk_producto_un_tipo` (`id_producto`);
COMMIT;

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`) VALUES
(1, 'Administrador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

--
-- Estructura de tabla para la tabla `rol_permiso`
--

CREATE TABLE `rol_permiso` (
  `id_rol_permiso` int NOT NULL,
  `id_rol` int DEFAULT NULL,
  `id_modulo` int DEFAULT NULL,
  `id_accion` int DEFAULT NULL,
  `permitido` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `rol_permiso`
--

INSERT INTO `rol_permiso` (`id_rol_permiso`, `id_rol`, `id_modulo`, `id_accion`, `permitido`) VALUES
(1, 1, 1, 1, 1),
(2, 1, 1, 2, 1),
(3, 1, 1, 3, 1),
(4, 1, 1, 4, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `rol_permiso`
--
ALTER TABLE `rol_permiso`
  ADD PRIMARY KEY (`id_rol_permiso`),
  ADD KEY `fk_rol_permiso_accion_3` (`id_accion`),
  ADD KEY `fk_rol_permiso_rol_2` (`id_rol`),
  ADD KEY `fk_rol_permiso_modulo_1` (`id_modulo`);

--
-- AUTO_INCREMENT de la tabla `rol_permiso`
--
ALTER TABLE `rol_permiso`
  MODIFY `id_rol_permiso` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Filtros para la tabla `rol_permiso`
--
ALTER TABLE `rol_permiso`
  ADD CONSTRAINT `FK_0334746855e524862699863be01` FOREIGN KEY (`id_accion`) REFERENCES `accion` (`id_accion`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_1d9e5be3d74310f98e398912d94` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_e6e3715f2aeb9bbf884493ef132` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`) ON DELETE CASCADE;
COMMIT;

--
-- Estructura de tabla para la tabla `separado`
--

CREATE TABLE `separado` (
  `id_separado` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `deuda_total` decimal(20,2) DEFAULT NULL,
  `deuda_pagada` decimal(20,2) DEFAULT NULL,
  `deuda_restante` decimal(20,2) DEFAULT NULL,
  `estado` tinyint DEFAULT NULL,
  `descripcion` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_comprobante` int DEFAULT NULL,
  `registrar` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `separado`
--
ALTER TABLE `separado`
  ADD PRIMARY KEY (`id_separado`) USING BTREE,
  ADD KEY `fk_credito_cliente_4` (`id_cliente`) USING BTREE,
  ADD KEY `id_usuario` (`id_usuario`) USING BTREE,
  ADD KEY `id_metodo_pago` (`id_metodo_pago`) USING BTREE,
  ADD KEY `fk_id_comprobante` (`id_comprobante`),
  ADD KEY `id_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `separado`
--
ALTER TABLE `separado`
  MODIFY `id_separado` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `separado`
--
-- ALTER TABLE `separado`
--   ADD CONSTRAINT `FK_5ec88147514df62a88efa01c0da` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
--   ADD CONSTRAINT `FK_6e5ccc42e008cf3da93b92ba622` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobante` (`id_comprobante`),
--   ADD CONSTRAINT `FK_8c40185b310ac8caa29a9ed6a8f` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
--   -- ADD CONSTRAINT `FK_bdf1e954c3415c94eeedc277348` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);
COMMIT;

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `id_comprobante` int DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `precio` decimal(20,2) DEFAULT NULL,
  `estado` int DEFAULT NULL,
  `numero_comprobante` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id_servicio`),
  ADD KEY `fk_servicio_usuario_1` (`id_usuario`),
  ADD KEY `fk_servicio_cliente_2` (`id_cliente`),
  ADD KEY `fk_servicio_comprobante_3` (`id_comprobante`),
  ADD KEY `fk_servicio_metodo_pago_4` (`id_metodo_pago`);

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `FK_2907f36e56be6ed641e296a82ff` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobante` (`id_comprobante`),
  -- ADD CONSTRAINT `FK_c0e93a29dca43268075a5532ac6` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`),
  ADD CONSTRAINT `FK_fa413743b859d33ad32426984f7` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);
COMMIT;

--
-- Estructura de tabla para la tabla `sub_categoria`
--

CREATE TABLE `sub_categoria` (
  `id_sub_categoria` int NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `id_categoria` int NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sub_categoria`
--
ALTER TABLE `sub_categoria`
  ADD PRIMARY KEY (`id_sub_categoria`),
  ADD KEY `id_categoria` (`id_categoria`) USING BTREE;

--
-- AUTO_INCREMENT de la tabla `sub_categoria`
--
ALTER TABLE `sub_categoria`
  MODIFY `id_sub_categoria` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `sub_categoria`
--
ALTER TABLE `sub_categoria`
  ADD CONSTRAINT `FK__categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`);
COMMIT;

--
-- Estructura de tabla para la tabla `sub_categoria_tipo_producto`
--

CREATE TABLE `sub_categoria_tipo_producto` (
  `id_sub_categoria_tipo_producto` int NOT NULL,
  `id_sub_categoria` int DEFAULT NULL,
  `id_tipo_producto` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sub_categoria_tipo_producto`
--
ALTER TABLE `sub_categoria_tipo_producto`
  ADD PRIMARY KEY (`id_sub_categoria_tipo_producto`),
  ADD KEY `id_tipo_producto` (`id_tipo_producto`),
  ADD KEY `id_sub_categoria` (`id_sub_categoria`) USING BTREE;

--
-- AUTO_INCREMENT de la tabla `sub_categoria_tipo_producto`
--
ALTER TABLE `sub_categoria_tipo_producto`
  MODIFY `id_sub_categoria_tipo_producto` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `sub_categoria_tipo_producto`
--
ALTER TABLE `sub_categoria_tipo_producto`
  -- ADD CONSTRAINT `FK__tipo_producto` FOREIGN KEY (`id_tipo_producto`) REFERENCES `tipo_producto` (`id_tipo_producto`),
  ADD CONSTRAINT `FK_sub_categoria_tipo_producto_sub_categoria` FOREIGN KEY (`id_sub_categoria`) REFERENCES `sub_categoria` (`id_sub_categoria`);
COMMIT;

--
-- Estructura de tabla para la tabla `ticket_credito`
--

CREATE TABLE `ticket_credito` (
  `id_ticket_credito` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL,
  `id_credito` int DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `monto_pago` decimal(20,2) DEFAULT '0.00',
  `num_comprobante` char(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deuda_restante` decimal(20,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ticket_credito`
--
ALTER TABLE `ticket_credito`
  ADD PRIMARY KEY (`id_ticket_credito`) USING BTREE,
  ADD KEY `FK_ticket_credito_usuario` (`id_usuario`),
  ADD KEY `FK_ticket_credito_credito` (`id_credito`),
  ADD KEY `FK_ticket_credito_metodo` (`id_metodo_pago`),
  ADD KEY `fk_ticket_credito_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `ticket_credito`
--
ALTER TABLE `ticket_credito`
  MODIFY `id_ticket_credito` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `ticket_credito`
--
ALTER TABLE `ticket_credito`
  ADD CONSTRAINT `FK_6879a8a912984ab1d4657ed4e5e` FOREIGN KEY (`id_credito`) REFERENCES `credito` (`id_credito`);
  -- ADD CONSTRAINT `FK_9c315c196822178c66780a1985b` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`),
  -- ADD CONSTRAINT `FK_d8fdb0e857d4ad0377150dbeaa0` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);
COMMIT;

--
-- Estructura de tabla para la tabla `tienda`
--

CREATE TABLE `tienda` (
  `id_tienda` int NOT NULL,
  `nombre` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `condicion` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tienda`
--
ALTER TABLE `tienda`
  ADD PRIMARY KEY (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `tienda`
--
ALTER TABLE `tienda`
  MODIFY `id_tienda` int NOT NULL AUTO_INCREMENT;
COMMIT;

--
-- Estructura de tabla para la tabla `tipo_producto`
--

CREATE TABLE `tipo_producto` (
  `id_tipo_producto` int NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  ADD PRIMARY KEY (`id_tipo_producto`);

--
-- AUTO_INCREMENT de la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  MODIFY `id_tipo_producto` int NOT NULL AUTO_INCREMENT;
COMMIT;

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL DEFAULT 'user',
  `deletedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_documento` int DEFAULT NULL,
  `numero_documento` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_cargo` int DEFAULT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `clave` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fondo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `condicion` tinyint DEFAULT NULL,
  `id_tienda` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `fk_usuario_cargo_1` (`id_cargo`),
  ADD KEY `fk_usuario_documento_2` (`id_documento`),
  ADD KEY `id_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_43d733c7d1a06e50bd987aab211` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
  ADD CONSTRAINT `FK_94b9d03900e900a07fb7fef63d9` FOREIGN KEY (`id_documento`) REFERENCES `documento` (`id_documento`),
  ADD CONSTRAINT `FK_94da063571d012832ad913852b3` FOREIGN KEY (`id_cargo`) REFERENCES `cargo` (`id_cargo`);
COMMIT;

--
-- Estructura de tabla para la tabla `usuario_permiso`
--

CREATE TABLE `usuario_permiso` (
  `id_usuario_permiso` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_modulo` int DEFAULT NULL,
  `id_accion` int DEFAULT NULL,
  `permitido` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuario_permiso`
--
ALTER TABLE `usuario_permiso`
  ADD PRIMARY KEY (`id_usuario_permiso`),
  ADD KEY `fk_usuario_permiso_usuario_1` (`id_usuario`),
  ADD KEY `fk_usuario_permiso_accion_3` (`id_accion`),
  ADD KEY `fk_usuario_permiso_modulo_2` (`id_modulo`);

--
-- AUTO_INCREMENT de la tabla `usuario_permiso`
--
ALTER TABLE `usuario_permiso`
  MODIFY `id_usuario_permiso` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `usuario_permiso`
--
ALTER TABLE `usuario_permiso`
  ADD CONSTRAINT `FK_28a46069e501976315ee98f7cad` FOREIGN KEY (`id_accion`) REFERENCES `accion` (`id_accion`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_b98790fdeb9deaf18f2d40fe91f` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`) ON DELETE CASCADE;
COMMIT;

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `id_usuario` int NOT NULL,
  `id_rol` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario_rol`
--

INSERT INTO `usuario_rol` (`id_usuario`, `id_rol`) VALUES
(1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD PRIMARY KEY (`id_usuario`,`id_rol`),
  ADD KEY `FK_96d2a6ecb2ad0931416610845cf` (`id_rol`);

--
-- Filtros para la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `FK_96d2a6ecb2ad0931416610845cf` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE CASCADE;
COMMIT;

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_venta` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `id_comprobante` int DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `numero_comprobante` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `impuesto` decimal(20,2) DEFAULT NULL,
  `total_venta` decimal(20,2) DEFAULT NULL,
  `id_estado_venta` int DEFAULT NULL,
  `garantia_tienda` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registrar` int DEFAULT NULL,
  `id_tienda` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `fk_venta_estado_venta_1` (`id_estado_venta`),
  ADD KEY `fk_venta_usuario_2` (`id_usuario`),
  ADD KEY `fk_venta_cliente_3` (`id_cliente`),
  ADD KEY `fk_venta_comprobante_4` (`id_comprobante`),
  ADD KEY `fk_venta_metodo_pago_5` (`id_metodo_pago`),
  ADD KEY `id_tienda` (`id_tienda`);

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` int NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `FK_0769833bb409323884fb3f38081` FOREIGN KEY (`id_estado_venta`) REFERENCES `estado_venta` (`id_estado_venta`),
  ADD CONSTRAINT `FK_3ffcfc4f0188bf52ee8348fd90d` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobante` (`id_comprobante`),
  ADD CONSTRAINT `FK_59f8e816f2e281194ca8cfcb13b` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`),
  ADD CONSTRAINT `FK_777d3faa95ab9ee43830dc14b8b` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);
COMMIT;

-- Bloque final: reinsertar FKs que referencian `usuario` tras su creació
ALTER TABLE `agenda`
  ADD CONSTRAINT `FK_31b61efe8dab28bfdb4c5d13eac` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `credito`
  ADD CONSTRAINT `FK_8f08e1d4d1b0bb1ddc1bc062915` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `egreso`
  ADD CONSTRAINT `FK_28314f48109e9e4222215887550` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `garantia`
  ADD CONSTRAINT `FK_f39ff499d92b930ce2f5b41b22a` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `ingreso`
  ADD CONSTRAINT `FK_6aee35098a90437ed44473662ec` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `pago_credito`
  ADD CONSTRAINT `FK_c92dd27080617301cccce6f222c` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `separado`
  ADD CONSTRAINT `FK_34627aef1e164a3e5223e21e86e` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `servicio`
  ADD CONSTRAINT `FK_5e9e2dbeca7eccb97e66302ea8a` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `ticket_credito`
  ADD CONSTRAINT `FK_2509a4174a0ca1409d568496046` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `usuario_permiso`
  ADD CONSTRAINT `FK_3ac61f49df6d59980b57d6bf160` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `FK_6adca3617fc69b2864e67196f2a` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

ALTER TABLE `venta`
  ADD CONSTRAINT `FK_20f57a0cfaec67d68d88ff8420d` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

-- FKs adicionales pospuestos por orden de índices referenciados
ALTER TABLE `cliente`
  ADD CONSTRAINT `FK_315b6f01dbaacfc460c1fbc38d5` FOREIGN KEY (`id_estado_cliente`) REFERENCES `estado_cliente` (`id_estado`),
  ADD CONSTRAINT `FK_c43220e4d77c03f8428f5d5cbdb` FOREIGN KEY (`id_documento`) REFERENCES `documento` (`id_documento`);

ALTER TABLE `credito`
  ADD CONSTRAINT `FK_a7bff996ee3c38b10013d115f40` FOREIGN KEY (`id_estado_credito`) REFERENCES `estado_credito` (`id_estado_credito`);

ALTER TABLE `credito`
  ADD CONSTRAINT `FK_5d9a8a20e81db7d77c7ffcac9b1` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);

ALTER TABLE `ingreso`
  ADD CONSTRAINT `FK_211c6bad5bd56f84241b425ddfc` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);

ALTER TABLE `separado`
  ADD CONSTRAINT `FK_bdf1e954c3415c94eeedc277348` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);

ALTER TABLE `separado`
  ADD CONSTRAINT `FK_5ec88147514df62a88efa01c0da` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);

ALTER TABLE `separado`
  ADD CONSTRAINT `FK_6e5ccc42e008cf3da93b92ba622` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobante` (`id_comprobante`);

ALTER TABLE `separado`
  ADD CONSTRAINT `FK_8c40185b310ac8caa29a9ed6a8f` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `servicio`
  ADD CONSTRAINT `FK_c0e93a29dca43268075a5532ac6` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);

-- FKs que referencian `tienda` movidas al final para asegurar PK activa
ALTER TABLE `credito`
  ADD CONSTRAINT `FK_eefc99912239d558fe18b13f63c` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `ticket_credito`
  ADD CONSTRAINT `FK_9c315c196822178c66780a1985b` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);

ALTER TABLE `venta`
  ADD CONSTRAINT `FK_24f7aa2ac1cc55e1c16c6e416de` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);

ALTER TABLE `pago_credito`
  ADD CONSTRAINT `FK_4d531bd9c2d0b23392df5f92a29` FOREIGN KEY (`id_plan_pago`) REFERENCES `plan_pago` (`id_plan_pago`);

ALTER TABLE `detalle_credito`
  ADD CONSTRAINT `FK_9daef3e4d7074366b7030c4ac0c` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

ALTER TABLE `detalle_separado`
  ADD CONSTRAINT `FK_2c5c0b4e5d6e7f8a9b0c1d2e3f4` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `FK_4e7e2d6f7a8b9c0d1e2f3a4b5c6` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `FK_5f8f3e7g8b9c0d1e2f3a4b5c6d7` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`);

ALTER TABLE `garantia`
  ADD CONSTRAINT `FK_7be54a96a6f88306b06f33f650a` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

ALTER TABLE `detalle_separado`
  ADD CONSTRAINT `FK_3d6d1c5e6f7a8b9c0d1e2f3a4b5` FOREIGN KEY (`id_separado`) REFERENCES `separado` (`id_separado`);

ALTER TABLE `pago_separado`
  ADD CONSTRAINT `FK_7e642ce0d3e4f5a6b7c8d9e0f1a2` FOREIGN KEY (`id_separado`) REFERENCES `separado` (`id_separado`);

ALTER TABLE `pago_separado`
  ADD CONSTRAINT `FK_d733ef2f5a6b7c8d9e0f1a2b3c4` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);

ALTER TABLE `pago_separado`
  ADD CONSTRAINT `FK_e844fg6a7b8c9d0e1f2a3b4c5d6` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

ALTER TABLE `pago_separado`
  ADD CONSTRAINT `FK_8b753df1e4f5a6b7c8d9e0f1a2b3` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `egreso`
  ADD CONSTRAINT `FK_26b54ab4599a0a918dc25fbe6f7` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `ingreso`
  ADD CONSTRAINT `FK_d26e350a1ab05d2b4fb5af8423f` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `garantia`
  ADD CONSTRAINT `FK_10cc628143984c1b2c7a8116733` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `pago_credito`
  ADD CONSTRAINT `FK_6a9413c04f25fc4809760318e39` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `ticket_credito`
  ADD CONSTRAINT `FK_d8fdb0e857d4ad0377150dbeaa0` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `producto_tienda`
  ADD CONSTRAINT `FK_6de564616cd9b19d1703f5281a3` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`);

ALTER TABLE `producto_tipo_producto`
  ADD CONSTRAINT `FK_producto_tipo_producto_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

ALTER TABLE `producto_tipo_producto`
  ADD CONSTRAINT `FK_producto_tipo_producto_tipo_producto` FOREIGN KEY (`id_tipo_producto`) REFERENCES `tipo_producto` (`id_tipo_producto`);

ALTER TABLE `sub_categoria_tipo_producto`
  ADD CONSTRAINT `FK__tipo_producto` FOREIGN KEY (`id_tipo_producto`) REFERENCES `tipo_producto` (`id_tipo_producto`);

-- Unicidad de entidades y relaciones principales (movido al final)
ALTER TABLE `categoria` ADD UNIQUE KEY `uk_categoria_nombre` (`nombre`);
ALTER TABLE `sub_categoria` ADD UNIQUE KEY `uk_sub_categoria_cat_nombre` (`id_categoria`,`nombre`);
ALTER TABLE `tipo_producto` ADD UNIQUE KEY `uk_tipo_producto_nombre` (`nombre`);
ALTER TABLE `sub_categoria_tipo_producto` ADD UNIQUE KEY `uk_subcat_tipo` (`id_sub_categoria`,`id_tipo_producto`);
-- Garantiza una sola clasificación de tipo por producto
ALTER TABLE `producto_tipo_producto` ADD UNIQUE KEY `uk_producto_un_tipo` (`id_producto`);

-- Rehabilitar verificación de claves foráneas al terminar todo
SET FOREIGN_KEY_CHECKS=1;