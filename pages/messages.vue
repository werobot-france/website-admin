<template>
	<div>
		<v-list subheader two-line v-if="!noMsg">
			<v-subheader>
				Derniers massages:
			</v-subheader>
			<v-list-tile v-for="msg in messages" :key="msg.id" @click="viewDialog = true; viewMessage = msg">
				<v-list-tile-content>
					<v-list-tile-title v-text="msg.subject" />
					<v-list-tile-sub-title><span class='text--primary'>{{ msg.author_name }}</span> &mdash; {{ msg.created_at }}</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
		<v-card v-if="noMsg">
			<v-card-text>
				Pas de messages
			</v-card-text>
		</v-card>
		<v-dialog max-width="500" v-model="viewDialog">
			<v-card>
				<v-card-title>
					{{ viewMessage.author_name }} ({{ viewMessage.author_email }})
				</v-card-title>
				<v-card-text>
					<div class="headline">{{ viewMessage.subject }}</div> <br>
					{{ viewMessage.content }}
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn color=primary flat @click="reply(viewMessage.author_email)">
						Répondre
					</v-btn>
					<v-btn color=error flat @click="deleteMsg(viewMessage.id)">
						Supprimer
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	created () {
		this.$store.commit('SET_TITLE', 'Messages')
		setTimeout(() => {
			this.fetchMsg()
		}, 200)
	},
	data: () => ({
		viewDialog: false,
		viewMessage: {},
		messages: [],
		noMsg: false
	}),
	methods: {
		fetchMsg () {
			this.$apitator.get("/message", {withAuth: true}).then((res)=> {
				this.messages = res.data.data.messages
				if (this.messages.length == 0) {
					this.noMsg = true
				}
			})
		},
		deleteMsg (id) {
			this.$apitator.delete("/message/" + id, {withAuth: true}).then(() => {
				this.$store.commit("ADD_ALERT", {text: "Message Supprimé!", color: "error"})
				this.viewDialog = false
				this.messages = this.messages.filter(message => message.id != id)
			})
		},
		reply (to) {
			window.location.href = "mailto:" + to
		}
	}
}
</script>

<style>
