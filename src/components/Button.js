//language=hbs
export default (`<button type="{{type}}" id="{{id}}" class="button-standard {{#if blue}}
button-standard-blue
{{/if}} {{#if red}}
button-standard-red
{{/if}}" onClick="{{callback}}">{{text}}</button>`);
