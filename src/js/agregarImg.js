import {Dropzone} from 'dropzone'


//Leemos el token
const token = document.querySelector("meta[name='csrf_token']").content

Dropzone.options.imagen = {
  dictDefaultMessage: "Sube tus imagenes aqui",
  acceptedFiles: ".png,.jpg,.jpeg",
  maxFilesize:5, //5Megas
  maxFiles:1,
  parallelUploads: 1,
  autoProcessQueue: false, //se subira la imagen hasta que presionen en el boton y no se suba automaticamente
  addRemoveLinks: true,
  dictRemoveFile: "Borrar archivo",
  dictMaxFilesExceeded: "El limite es 1 Archivo",
  headers:{
    "CSRF-Token" : token
  },
  paramName: "imagen",
  init: function(){
    const dropzone = this
    const btnPublicar = document.querySelector("#publicar")

    btnPublicar.addEventListener("click", function(){
      dropzone.processQueue()
    })

    dropzone.on("queuecomplete", function(file, mensaje){
      if(dropzone.getActiveFiles().length == 0){
        window.location.href = "mis-propiedades"
      }
    })
  }
}