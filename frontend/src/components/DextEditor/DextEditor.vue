<template>
  <div id="editor_area1111" />
</template>

<script>
export default {
    props: {
      editorname:{type: String, default:'Editor1'},     
      value: {type:String, default:''},


    },
    data: () => ({
         editor : null,
         myDEXT5 : null
     }),

    watch:{
        value(val){
            this.myDEXT5.setHtmlValueEx(val, this.editorname);            
        }
    },
    mounted() {

        // eslint-disable-next-line no-undef
        this.myDEXT5 = DEXT5;

        // eslint-disable-next-line no-undef
        this.myDEXT5.config.EditorHolder = 'editor_area1111';
        // eslint-disable-next-line no-undef
        this.editor = new Dext5editor(this.editorname);

        

        
    },
     methods:{
        updateData() {          
            var contents = this.myDEXT5.getHtmlValueEx(this.editorname);
            console.log(contents);
            this.$emit('input', contents);
        }
    }




}
</script>

<style>

</style>