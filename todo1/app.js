/**
 * Created by Administrator on 2017/3/7.
 */

var store = {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    fetch(key){
        return JSON.parse(localStorage.getItem(key)) || [];
    }
};

var list = store.fetch('todoList');
var filter = {
    'all': function (list) {
        return list;
    },
    'unfinished': function (list) {
        return list.filter(function (item) {
            return !item.isChecked;
        })
    },
    'finished': function (list) {
        return list.filter(function (item) {
            return item.isChecked;
        })
    }
};
var app = new Vue({
    el: '.main',
    data: {
        list: list,
        todo: '',
        editingTodo: '',  //记录正在编辑的任务
        beforeTitle: '',   //编辑之前记录title的数据
        visibility: 'all'
    },
    computed: {
        noselectLen() {
            return this.list.filter(function (item) {
                return !item.isChecked;
            }).length
        },
        filterList(){
            //判断hash值是否存在
            return filter[this.visibility] ? filter[this.visibility](this.list) : list;
        }

    },
    watch: {
        list: {
            handler(){
                store.save('todoList', this.list);
            },
            deep: true
        }
    },
    methods: {
        addTodo(){
            this.list.push({
                title: this.todo,
                isChecked: false
            });
            this.todo = '';
        },
        deleteTodo(index){
            this.list.splice(index, 1);
        },
        editTodo(todo){   //编辑任务
            //console.log(todo);
            this.beforeTitle = todo.title;
            this.editingTodo = todo;
        },
        editTodoed(){  //完成编辑
            this.editingTodo = '';
        },
        cancelEditTodo(todo){  //取消编辑
            todo.title = this.beforeTitle;
            this.editingTodo = '';
        }
    },
    directives: {
        focus: {
            update(el, binding){
                if (binding.value) {
                    el.focus();
                }
            }
        }
    }
});
watchHashChange();
window.addEventListener('hashchange', watchHashChange);
function watchHashChange() {
    var hash = window.location.hash.replace(/#\/?/, '');
    app.visibility = hash;
}