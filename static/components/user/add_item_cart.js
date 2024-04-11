const add_item_cart = Vue.Component('add-item-cart',{
    props: ['prod.id'],
    template: `
                <div class="input-group mb-3" style="width:140px">
                    <input type="number" class="form-control" v-model="quant">
                    <button class="btn btn-warning" type="button" @click="cart(prod.id)"><i class="bi bi-cart"></i></button>
                </div>
    `,

})