<template>
    <div 
      class="p-2"
      v-if="editor"
      >
      <v-card         
        class="p-2 defaultBackColor"
        >
         <v-toolbar   
          flat
          dense
          v-if="editable"
          >

           <v-btn 
            icon 
            @click="editor.chain().focus().undo().run()"
            >      
            <v-icon>undo</v-icon> 
            </v-btn>
            <v-btn 
              icon 
              @click="editor.chain().focus().redo().run()"
              >
              <v-icon>redo</v-icon>       
            </v-btn>    
            <v-btn-toggle         
              dense                                    
            >
              <v-btn 
                :class="{ 'v-btn--active': editor.isActive('bold') }"                
                @click="editor.chain().focus().toggleBold().run()" 
                >
                <v-icon>mdi-format-bold</v-icon> 
              </v-btn>    

              <v-btn 
                :class="{ 'v-btn--active': editor.isActive('italic') }"                
                @click="editor.chain().focus().toggleItalic().run()" 
                >
                <v-icon>mdi-format-italic</v-icon> 
              </v-btn>    

              <v-btn 
                :class="{ 'v-btn--active': editor.isActive('strike') }"                
                @click="editor.chain().focus().toggleStrike().run()" 
                >
                <v-icon>format_strikethrough</v-icon> 
              </v-btn>             
            </v-btn-toggle>

            <v-btn 
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" 
              :class="{ 'v-btn--active': editor.isActive('heading', { level: 1 }) }"
              >
              h1
            </v-btn>
            
            <v-btn 
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" 
              :class="{ 'v-btn--active': editor.isActive('heading', { level: 2 }) }"
              >
              h2
            </v-btn>
            <v-btn 
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" 
              :class="{ 'v-btn--active': editor.isActive('heading', { level: 3 }) }"
              >
              h3
            </v-btn>
            <v-btn 
              @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" 
              :class="{ 'v-btn--active': editor.isActive('heading', { level: 4 }) }"
              >
              h4
            </v-btn>
            <v-btn 
              @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" 
              :class="{ 'v-btn--active': editor.isActive('heading', { level: 5 }) }"
              >
              h5
            </v-btn>
            <v-btn 
              @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" 
              :class="{ 'v-btn--active': editor.isActive('heading', { level: 6 }) }"
              >
              h6
            </v-btn>
             <v-btn 
              @click="editor.chain().focus().setTextAlign('left').run()" 
              :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
              >
              <v-icon>format_align_left</v-icon> 
            </v-btn>
            <v-btn 
              @click="editor.chain().focus().setTextAlign('center').run()" 
              :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
              >
            <v-icon>format_align_center</v-icon> 
            </v-btn>
            <v-btn 
              @click="editor.chain().focus().setTextAlign('right').run()" 
              :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
              >
              <v-icon>format_align_right</v-icon> 
            </v-btn>
            <v-btn 
              @click="editor.chain().focus().setTextAlign('justify').run()" 
              :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
              >
            <v-icon>format_align_justify</v-icon>                           
          </v-btn>


           <v-btn @click="addImage">
            <v-icon>image</v-icon>                           
          </v-btn>

         </v-toolbar>
       

      




    <!-- <v-btn icon @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <v-icon>format_italic</v-icon> 
    </v-btn>
    <v-btn icon @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      <v-icon>strike</v-icon>       
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
      code
    </v-btn>
    <v-btn @click="editor.chain().focus().unsetAllMarks().run()">
      clear marks
    </v-btn>
    <v-btn @click="editor.chain().focus().clearNodes().run()">
      clear nodes
    </v-btn>
    <v-btn @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
      paragraph
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
      h1
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
      h2
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
      h3
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
      h4
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
      h5
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
      h6
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
      bullet list
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
      ordered list
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
      code block
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
      blockquote
    </v-btn>
    <v-btn @click="editor.chain().focus().setHorizontalRule().run()">
      horizontal rule
    </v-btn>
    <v-btn @click="editor.chain().focus().setHardBreak().run()">
      hard break
    </v-btn> -->
    

        
        <editor-content             
            :editor="editor"             
        />

      
      
      </v-card>

      
    </div>
</template>

<script>

import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
//import Dropcursor from '@tiptap/extension-dropcursor'



// import { Bold, Italic, Link, HardBreak, Heading } from 'tiptap-extensions'

export default {
    components: {
        //EditorMenuBar,
        EditorContent
        
    },
    props: {
          value: {
                type: String,
                default: '',
                },
            
          editable: {
                type: Boolean,
                default: false,        
              },
          height: {
                type: String,
                default: '500px',        

          }

    },
    data: () => ({
         editor: null,
     }),
     watch: {
        value(value) {
            // HTML
            const isSame = this.editor.getHTML() === value;

            // JSON
            // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)
            if (isSame) {
                return;
            }

            this.editor.commands.setContent(value, false);
        },
         editable(value)
         {           
           this.editor.setEditable(value);
         }

  },
    mounted() {
         this.editor = new Editor({
              content: this.value,
              editable: this.editable,
              extensions: [
                    StarterKit,
                     TextAlign.configure({
                      types: ['heading', 'paragraph'],
                    }),
                    Image.configure({
                      inline: true,
                       allowBase64: true,
                    }),
                    //Dropcursor,


                ],
                onUpdate: () => {
                    // HTML
                    this.$emit('input', this.editor.getHTML())

                    // JSON
                    // this.$emit('input', this.editor.getJSON())
                },
                editorProps: {
                    attributes: {
                      class: '',
                      style: "height : " + this.height + "; overflow-y: scroll; margin:10px"
                    },
                  
                  }

            });
        
    },
    beforeDestroy() {
        if (this.editor !== null) {        
            this.editor.destroy();
        }
    },

    methods:{
      addImage() {
        const url = window.prompt('URL')
        if (url) {
            this.editor.chain().focus().setImage({ src: url }).run()
          }
        },
    }

}
</script>

<style scoped lang="scss">

    /* remove outline */
    :deep(.ProseMirror:focus) {
      outline: none; 
    }
    /* set */
    :deep(.ProseMirror) {          
      /* height:500px !important;
      overflow-y: scroll; */
      background-color: #FAFAFA !important;
    }
    :deep(.v-toolbar__content){	    
      background-color:#fafafa;

    }
</style>