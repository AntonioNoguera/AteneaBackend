# Atenea Backend Requirements

# Sub entidades

Archivo

Contenido Temático

# Listado de Entidades

[ Como se esperan las respuestas ]

## Usuario

Pendiente revisar como se puede trabajar de mejor forma el tema de permisos.

```json
{
	id: 0,
	fullName: "",
	passwordHash: "",
	passwordSalt: "",
	createdAt: TimeStamp,
	persmissions: ""?
}
```

permissions: [

]

## Departamento

```json
{
	id: 0,
	name: "",
	lastModification: TimeStamp,
	lastContributor: UserEntity,
}
```

## Academia

```json
{
	id: 0,
	name: "",
	parentDepartment: DeparmentEntity,
	lastModification: TimeStamp,
	lastContributor: UserEntity,
}
```

## Materia

```json
{
	id: 0,
	name: ""
	parentAcademy: AcademyEntity,
	plan: ENUM, // 401, 402, 4040
	lastModification: TimeStamp,
	lastContributor: UserEntity,
	dataInfo: {
		halfTerm: [
			{
				position: 0,
				data: "Theme 1"
			}, 
		], 
		ordinary: {
			{
				position: 0,
				data: "Theme 1"
			}, 
		},
		files: [
			{
				ResourcesEntity
			}
		]
	} 
}
```

## ResourcesEntity

```json
{   
 {
	name: "",
	fileType: "",
	content: "",
	size: ""
}

}
```
