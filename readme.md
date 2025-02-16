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
	createdAt: TimeStamp
}
```

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
	parentDepartment: ParentEntity,
	lastModification: TimeStamp,
	lastContributor: UserEntity,
}
```

## Materia

```json
{
	id: 0,
	name: 
	parentAcademy: AcademyEntity,
	plan: ENUM, 
	lastModification: TimeStamp,
	lastContributor: UserEntity,
	dataInfo: {
		halfTerm: [
			{
				count: 0,
				data: "Theme 1"
			},
			
			{
				count: 0,
				data: "Theme 1"
			}, 
		], 
		ordinary: {
			{
				count: 0,
				data: "Theme 1"
			},
			{
				count: 0,
				data: "Theme 1"
			}, 
		},
		files: [
			{
				id: 0,
				name: "", 
			}
		]
	} 
}
```

## Resources

```json
{  
type: "file" | "theme",
content: {
		name: "",
		fileType: "",
		size: ""
	}

}
```
