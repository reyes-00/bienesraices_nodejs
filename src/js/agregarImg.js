import {Dropzone} from 'dropzone'

Dropzone.options.imagen = {
  dictDefaultMessage: "Sube tus imagenes aqui",
  acceptedFiles: ".png,.jpg,.jpeg",
  maxFilesize:5, //5Megas
  maxFiles:1,
  parallelUploads: 1,
  autoProcessQueue: false, //se subira la imagen hasta que presionen en el boton y no se suba automaticamente
  addRemoveLinks: true,
  dictRemoveFile: "Borrar archivo",
  dictMaxFilesExceeded: "El limite es 1 Archivo"
}