<template>
  <v-app id="inspire">
    <v-container>
      <v-row>
        <v-col
          cols="4"
          offset="4"
        >
          <v-card>
            <v-card-title
              class="info white--text subheading"
              primary-title
            >
              <span class="title">Oops</span>
            </v-card-title>
            <v-card-text class="display-1  text-center">
              404. 존재하지 않는 페이지 입니다.
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                block
                class="info darken-3 white--text"
                to="/"
              >
                <v-icon
                  left
                  v-text="'mdi-arrow-left'"
                />
                Back
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  export default {
  
  }
</script>