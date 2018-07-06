import 'babel-polyfill';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';

export const Links = new Mongo.Collection('links');

if (Meteor.isServer) {
  Meteor.publish('linksPub', function (){
    userId = this.userId;
    return Links.find({userId});
  });
}

Meteor.methods({
  'links.insert'(url) {
    if (!this.userId)
      throw new Meteor.Error('NOT_AUTHORIZED', 'No user signed in');

    new SimpleSchema({
      url: {
        label: 'Your link',
        regEx: SimpleSchema.RegEx.Url,
        type: String
      }
    }).validate({url});

    Links.insert({
      _id: shortid.generate(),
      lastVisitedAt: null,
      url,
      userId: this.userId,
      visible: true,
      visitedCount: 0
    });
  },

  'links.setVisibility'(_id, visible) {
    if (!this.userId)
      throw new Meteor.Error('NOT_AUTHORIZED', 'No user signed in');

    new SimpleSchema({
      _id: {min: 1, type: String},
      visible: {type: Boolean}
    }).validate({_id, visible});

    Links.update({_id, userId: this.userId}, {$set: {visible}})
  },

  'links.trackVisit'(_id) {
    new SimpleSchema({_id: {min: 1, type: String}}).validate({_id});

    Links.update({_id}, {
      $set: {lastVisitedAt: new Date().getTime()},
      $inc: {visitedCount: 1}
    });
  }
});
