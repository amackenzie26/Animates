// Linked List implementation
class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    push(data) {
        if(!this.head) {
            this.head = data;
            return;
        }
        let cur = this.head;
        while(cur.next) {
            cur = cur.next;
        }

        cur.next = new ListNode(data);
    }

    pop() {
        if(!this.head) return;
        if(!this.head.next) {
            let temp = this.head.data;
            this.head = null;
            return temp;
        }
        let cur=this.head;
        while(cur.next.next) {
            cur = cur.next;
        }
        let temp = cur.next.data;
        cur.next = null;
        return temp;
    }

    getIndex(i) {
        let count = 0;
        let cur = this.head;
        while(count < i) {
            count++;
            cur = cur.next;
        }
        return cur.data;
    }

    removeIndex(i) {
        let count = 0;
        let cur = this.head;
        while(count < i-1) {
            count++;
            cur = cur.next;
        }
        let temp = cur.next.data;
        cur.next = cur.next.next;
        return temp;
    }

    size() {
        if(!this.head) return 0;
        let count=1;
        let cur = this.head;
        while(cur.next) {
            cur = cur.next;
            count++;
        }
    }
}