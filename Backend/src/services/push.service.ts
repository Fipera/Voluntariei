import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import prisma from '../utils/prisma';


const expo = new Expo();




export async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return false;
  }

  const message: ExpoPushMessage = {
    to: pushToken,
    sound: 'default',
  channelId: 'default',
    title,
    body,
    data,
    priority: 'high',
  };

  try {
    const tickets = await expo.sendPushNotificationsAsync([message]);
    const ticket = tickets[0];

    if (ticket.status === 'error') {
      console.error(`Error sending push notification: ${ticket.message}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}




export async function sendBulkPushNotifications(
  recipients: Array<{ pushToken: string; title: string; body: string; data?: Record<string, any> }>
): Promise<{ success: number; failed: number }> {
  const messages: ExpoPushMessage[] = [];

  
  for (const recipient of recipients) {
    if (!Expo.isExpoPushToken(recipient.pushToken)) {
      console.error(`Push token ${recipient.pushToken} is not valid`);
      continue;
    }

    messages.push({
      to: recipient.pushToken,
      sound: 'default',
  channelId: 'default',
      title: recipient.title,
      body: recipient.body,
      data: recipient.data,
      priority: 'high',
    });
  }

  if (messages.length === 0) {
    return { success: 0, failed: 0 };
  }

  let successCount = 0;
  let failedCount = 0;

  try {
    
    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);

      for (const ticket of tickets) {
        if (ticket.status === 'ok') {
          successCount++;
        } else {
          failedCount++;
          console.error(`Push notification error: ${(ticket as any).message}`);
        }
      }
    }
  } catch (error) {
    console.error('Error sending bulk push notifications:', error);
    failedCount = messages.length - successCount;
  }

  return { success: successCount, failed: failedCount };
}




export async function notifyVoluntaryPush(
  voluntaryId: number,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  const voluntary = await prisma.voluntary.findUnique({
    where: { id: voluntaryId },
    select: { pushToken: true },
  });

  if (voluntary?.pushToken) {
    await sendPushNotification(voluntary.pushToken, title, body, data);
  }
}




export async function notifyInstitutionPush(
  institutionId: number,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { pushToken: true },
  });

  if (institution?.pushToken) {
    await sendPushNotification(institution.pushToken, title, body, data);
  }
}




export async function notifyVoluntariesPush(
  voluntaryIds: number[],
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  const voluntaries = await prisma.voluntary.findMany({
    where: { id: { in: voluntaryIds } },
    select: { pushToken: true },
  });

  const recipients = voluntaries
    .filter((v) => v.pushToken)
    .map((v) => ({
      pushToken: v.pushToken!,
      title,
      body,
      data,
    }));

  if (recipients.length > 0) {
    await sendBulkPushNotifications(recipients);
  }
}
