(function (globals, $) {

    nunjucks.configure('/static/admin/templates', {
        autoescape: true
    });

    var InviteModel = Backbone.Model.extend({
        defaults: {
            // name: 'Benny'
        }
    });

    var InviteCollection = Backbone.Collection.extend({
        model: InviteModel,
        url: location.href
    });

    var InviteFormView = Backbone.View.extend({
        tagName: 'form',
        className: 'modal fade',
        events: {
            'hidden.bs.modal': 'remove',
            'submit': 'submit'
        },
        initialize: function () {
            this.$el.html(nunjucks.render('invites/form.html', {
                invite: this.model
            }));
        },
        submit: function (event) {
            event.preventDefault();
            var data = this.$el.serializeObject();
            this.model.save(data);
            this.$el.modal('hide');
            this.model.collection.add(this.model);
        }
    });

    var InvitesView = Backbone.View.extend({
        events: {
            'click span.invite-add': 'add'
        },
        initialize: function () {
            this.listenTo(this.collection, 'sync', this.render);
            this.collection.fetch();
        },
        render: function () {
            this.$('table tbody').empty();
            var fragment = document.createDocumentFragment();
            this.collection.each(function (model) {
                var html = nunjucks.render('invites/row.html', {
                    invite: model
                });
                fragment.appendChild($(html).get(0));
            }, this);
            this.$('table tbody').html(fragment);
        },
        add: function () {
            var model = new InviteModel(null, {
                collection: this.collection
            });
            var modal = new InviteFormView({
                model: model
            });
            this.$el.append(modal.el);
            modal.$el.modal();
        }
    });

    $.fn.invites = function (options) {
        return this.each(function () {
            if (!$.data(this, 'invites')) {
                $.data(this, 'invites', new InvitesView(_.extend({
                    collection: new InviteCollection(),
                    el: $(this)
                }, options)));
            }
        });
    };

}(this, jQuery));
